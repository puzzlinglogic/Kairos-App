import Anthropic from '@anthropic-ai/sdk';

const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

if (!apiKey) {
  console.warn('Anthropic API key not found. Pattern detection will not work.');
}

export const anthropic = new Anthropic({
  apiKey: apiKey || '',
  dangerouslyAllowBrowser: true, // For client-side usage
});

export interface WordFrequency {
  word: string;
  count: number;
}

export interface ThemeAnalysis {
  theme: string;
  frequency: number;
  description: string;
}

export interface PatternInsight {
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  category: 'temporal' | 'emotional' | 'behavioral' | 'cognitive';
}

/**
 * Tier 1: Quick analysis using Claude Haiku
 * Extracts word frequency and basic themes
 */
export const analyzePatternsQuick = async (
  entries: Array<{ entry_text: string; guided_response?: string; created_at: string }>
): Promise<{ wordFrequency: WordFrequency[]; themes: ThemeAnalysis[] }> => {
  const entriesText = entries
    .map((e, i) => {
      const date = new Date(e.created_at).toLocaleDateString();
      return `Entry ${i + 1} (${date}):\n${e.entry_text}${
        e.guided_response ? `\n\nReflection: ${e.guided_response}` : ''
      }`;
    })
    .join('\n\n---\n\n');

  const prompt = `Analyze these journal entries and extract:
1. Top 10 most meaningful words (exclude common words like "the", "and", "I")
2. Recurring themes (like "gratitude", "work stress", "relationships", "creativity", etc.)

Journal Entries:
${entriesText}

Respond in this exact JSON format:
{
  "wordFrequency": [{"word": "word", "count": number}],
  "themes": [{"theme": "theme name", "frequency": number, "description": "brief description"}]
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    }

    throw new Error('Failed to parse response');
  } catch (error) {
    console.error('Quick analysis error:', error);
    throw error;
  }
};

/**
 * Tier 2: Deep analysis using Claude Sonnet
 * Generates narrative insights about patterns
 */
export const analyzePatternsDeep = async (
  entries: Array<{ entry_text: string; guided_response?: string; created_at: string }>,
  quickAnalysis: { wordFrequency: WordFrequency[]; themes: ThemeAnalysis[] }
): Promise<PatternInsight[]> => {
  const entriesText = entries
    .map((e, i) => {
      const date = new Date(e.created_at).toLocaleDateString();
      const day = new Date(e.created_at).toLocaleDateString('en-US', { weekday: 'long' });
      return `Entry ${i + 1} (${day}, ${date}):\n${e.entry_text}${
        e.guided_response ? `\n\nReflection: ${e.guided_response}` : ''
      }`;
    })
    .join('\n\n---\n\n');

  const prompt = `You are analyzing journal entries to find meaningful patterns.

Quick Analysis Results:
- Top Words: ${quickAnalysis.wordFrequency.map((w) => w.word).join(', ')}
- Themes: ${quickAnalysis.themes.map((t) => t.theme).join(', ')}

Journal Entries:
${entriesText}

Find 3-5 specific, actionable patterns. Look for:
- Temporal patterns (what happens on certain days/times)
- Emotional patterns (mood shifts, triggers)
- Behavioral patterns (habits, decisions)
- Cognitive patterns (recurring thoughts, beliefs)

For each pattern, provide:
- A clear, specific title (e.g., "Coffee shops spark creativity")
- A description explaining the pattern with examples
- Confidence level (high/medium/low)
- Category (temporal/emotional/behavioral/cognitive)

Respond in this exact JSON format:
{
  "insights": [
    {
      "title": "specific pattern title",
      "description": "detailed explanation with examples from entries",
      "confidence": "high",
      "category": "emotional"
    }
  ]
}`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.insights || [];
      }
    }

    throw new Error('Failed to parse response');
  } catch (error) {
    console.error('Deep analysis error:', error);
    throw error;
  }
};
