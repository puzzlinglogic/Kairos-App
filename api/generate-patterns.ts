import type { VercelRequest, VercelResponse } from '@vercel/node';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Initialize Supabase Admin Client (bypasses RLS)
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

interface PatternData {
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  category: 'emotional' | 'temporal' | 'behavioral' | 'cognitive';
}

interface AIResponse {
  patterns: PatternData[];
}

interface GenerationResult {
  patterns: PatternData[];
  model: 'sonnet' | 'haiku';
}

// Timeout constant (8.5 seconds to stay under Vercel's 10-second limit)
const SONNET_TIMEOUT_MS = 8500;

/**
 * Helper function to generate patterns with a specific Claude model
 */
async function generateWithModel(
  model: 'claude-3-5-sonnet-20240620' | 'claude-3-haiku-20240307',
  systemPrompt: string,
  userPrompt: string
): Promise<PatternData[]> {
  const message = await anthropic.messages.create({
    model,
    max_tokens: 2048,
    temperature: 0.7,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: userPrompt,
      },
    ],
  });

  // Extract the response text
  const responseText = message.content[0].type === 'text'
    ? message.content[0].text
    : '';

  if (!responseText) {
    throw new Error('No response text from Claude');
  }

  // Parse the JSON response
  let aiResponse: AIResponse;
  try {
    // Try to extract JSON if it's wrapped in markdown code blocks
    const jsonMatch = responseText.match(/```json\n?([\s\S]*?)\n?```/) || responseText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
    aiResponse = JSON.parse(jsonText);
  } catch (parseError) {
    console.error('Failed to parse Claude response:', responseText);
    throw new Error('Failed to parse AI response as JSON');
  }

  // Validate response structure
  if (!aiResponse.patterns || !Array.isArray(aiResponse.patterns) || aiResponse.patterns.length !== 3) {
    throw new Error('AI response does not contain exactly 3 patterns');
  }

  return aiResponse.patterns;
}

/**
 * Creates a timeout promise that rejects after the specified duration
 */
function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout')), ms);
  });
}

/**
 * Attempts to generate patterns with Sonnet, falling back to Haiku if it times out
 */
async function generatePatternsWithFallback(
  systemPrompt: string,
  userPrompt: string
): Promise<GenerationResult> {
  try {
    // Race Sonnet against the timeout
    const patterns = await Promise.race([
      generateWithModel('claude-3-5-sonnet-20240620', systemPrompt, userPrompt),
      createTimeout(SONNET_TIMEOUT_MS),
    ]);

    // Sonnet finished in time
    console.log('✓ Sonnet completed successfully');
    return { patterns, model: 'sonnet' };
  } catch (error: any) {
    // Always fall back to Haiku on any error (timeout, 404, network, etc.)
    console.warn('⚠ Sonnet failed (Error: ' + error.message + '), falling back to Haiku');

    // Fallback to Haiku
    try {
      const patterns = await generateWithModel('claude-3-haiku-20240307', systemPrompt, userPrompt);
      console.log('✓ Haiku completed successfully');
      return { patterns, model: 'haiku' };
    } catch (haikuError) {
      console.error('✗ Haiku also failed:', haikuError);
      throw new Error('Both Sonnet and Haiku failed to generate patterns');
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId } = req.body;

    // Validate user ID
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Fetch the last 10 journal entries for this user
    const { data: entries, error: entriesError } = await supabase
      .from('entries')
      .select('entry_text, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (entriesError) {
      console.error('Error fetching entries:', entriesError);
      return res.status(500).json({ error: 'Failed to fetch journal entries' });
    }

    if (!entries || entries.length === 0) {
      return res.status(400).json({ error: 'No journal entries found for analysis' });
    }

    // Format entries for Claude
    const formattedEntries = entries
      .reverse() // Show oldest to newest for chronological context
      .map((entry, index) => {
        const date = new Date(entry.created_at).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        return `Entry ${index + 1} (${date}):\n${entry.entry_text}`;
      })
      .join('\n\n---\n\n');

    // Create the AI prompt
    const systemPrompt = `You are an expert psychologist and data scientist specializing in personal growth and behavioral analysis.

Your task is to analyze journal entries and identify deep, non-obvious patterns. Look beyond surface-level observations to find meaningful connections between:
- Emotional states and their triggers
- Temporal patterns (day of week, time-based cycles)
- Behavioral loops and habits
- Cognitive patterns (recurring thoughts, beliefs, mental models)

Focus on insights that would genuinely help the person understand themselves better. Avoid generic or obvious observations.

You must return EXACTLY 3 patterns in strict JSON format. Each pattern must have:
- title: A clear, specific title (max 60 characters)
- description: A detailed explanation of the pattern and its significance (2-3 sentences)
- confidence: 'high', 'medium', or 'low' based on how clear the pattern is
- category: 'emotional', 'temporal', 'behavioral', or 'cognitive'`;

    const userPrompt = `Analyze these journal entries and identify exactly 3 distinct patterns:

${formattedEntries}

Return your analysis as a JSON object with this exact structure:
{
  "patterns": [
    {
      "title": "Pattern title here",
      "description": "Detailed description here",
      "confidence": "high",
      "category": "emotional"
    }
  ]
}

Here is the JSON:`;

    // Generate patterns with fallback mechanism
    const result = await generatePatternsWithFallback(systemPrompt, userPrompt);

    // Delete old unacknowledged patterns for this user (keep things fresh)
    await supabase
      .from('patterns')
      .delete()
      .eq('user_id', userId)
      .eq('is_acknowledged', false);

    // Insert new patterns into the database
    const patternsToInsert = result.patterns.map((pattern) => ({
      user_id: userId,
      pattern_type: 'ai_insight',
      pattern_data: {
        title: pattern.title,
        description: pattern.description,
        confidence: pattern.confidence,
        category: pattern.category,
      },
      insight_text: `${pattern.title}: ${pattern.description.substring(0, 100)}...`,
      is_acknowledged: false,
    }));

    const { error: insertError } = await supabase
      .from('patterns')
      .insert(patternsToInsert);

    if (insertError) {
      console.error('Error inserting patterns:', insertError);
      return res.status(500).json({ error: 'Failed to save patterns to database' });
    }

    // Return success with metadata
    return res.status(200).json({
      success: true,
      patterns: result.patterns,
      meta: {
        model: result.model,
      },
      message: `Successfully generated ${result.patterns.length} patterns using ${result.model}`,
    });

  } catch (error: any) {
    console.error('Error generating patterns:', error);
    return res.status(500).json({
      error: 'Failed to generate patterns',
      details: error.message
    });
  }
}
