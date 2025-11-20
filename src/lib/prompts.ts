export const JOURNAL_PROMPTS = [
  // Self-Reflection & Patterns
  "What is a lesson I am learning the hard way right now?",
  "Where did I feel resistance today, and why?",
  "What gave me energy vs. what drained me?",
  "What is a pattern I keep repeating?",
  "What am I avoiding that I know I need to face?",
  "What would I do differently if I wasn't afraid?",
  "What truth am I not ready to admit to myself?",

  // Time & Perspective
  "If I could send a message to myself 5 years ago, what would I say?",
  "What would my future self thank me for starting today?",
  "What have I outgrown that I'm still holding onto?",
  "What season of life am I in right now?",
  "What would I regret not doing a year from now?",

  // Gratitude & Joy
  "What small moment today am I grateful for?",
  "What brought me unexpected joy recently?",
  "Who in my life deserves more appreciation?",
  "What privilege am I taking for granted?",

  // Emotions & Inner World
  "What emotion have I been suppressing lately?",
  "What does my anxiety want to tell me?",
  "Where in my body am I holding tension?",
  "What would it feel like to fully accept myself right now?",
  "What story am I telling myself that may not be true?",

  // Growth & Purpose
  "What is calling to me that I keep ignoring?",
  "Where am I playing small in my life?",
  "What boundary do I need to set or reinforce?",
  "What skill or quality am I developing right now?",
  "What does success actually mean to me?",

  // Relationships & Connection
  "What conversation am I avoiding having?",
  "How did I show up for someone today?",
  "What relationship needs more attention?",
  "Who do I need to forgive, including myself?",

  // Present Moment
  "What is the most important thing I need to focus on right now?",
  "What decision have I been postponing?",
  "What needs to be released before I can move forward?",
  "What is the universe trying to show me?",
  "What synchronicity or sign did I notice today?",

  // Values & Alignment
  "Am I living in alignment with my values today?",
  "What compromise am I no longer willing to make?",
  "What does my ideal day look like?",
  "What brings me closer to the person I want to become?",
];

export const getRandomPrompt = (): string => {
  const randomIndex = Math.floor(Math.random() * JOURNAL_PROMPTS.length);
  return JOURNAL_PROMPTS[randomIndex];
};
