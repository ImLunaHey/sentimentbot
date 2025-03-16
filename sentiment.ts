import Sentiment from 'sentiment';

const SENTIMENT_CATEGORIES = [
  [-3, 'extremely negative'], // -5 to -3 range
  [-1.5, 'very negative'], // -3 to -1.5 range
  [-0.5, 'negative'], // -1.5 to -0.5 range
  [-0.1, 'slightly negative'], // -0.5 to -0.1 range
  [0.1, 'neutral'], // -0.1 to 0.1 range
  [0.5, 'slightly positive'], // 0.1 to 0.5 range
  [1.5, 'positive'], // 0.5 to 1.5 range
  [3, 'very positive'], // 1.5 to 3 range
  [Infinity, 'extremely positive'], // 3 to 5 range
] as const;

type SentimentCategory = (typeof SENTIMENT_CATEGORIES)[number][1];
const sentimentAnalyzer = new Sentiment();

/**
 * Analyzes an array of strings and returns a sentiment score
 *
 * @param texts - Array of strings to analyze
 * @param options - Optional configuration for sentiment analysis
 * @returns A sentiment score (comparative value from AFINN analysis)
 */
export function analyzeSentimentScore(
  texts: string[],
  options?: {
    language?: string;
    extras?: Record<string, number>;
  },
): number {
  return texts.length > 0
    ? texts.map((text) => sentimentAnalyzer.analyze(text, options).comparative).reduce((sum, score) => sum + score, 0) /
        texts.length
    : 0;
}

/**
 * Analyzes a sentiment score and returns a sentiment category
 *
 * @param score - The comparative sentiment score (can range from -5 to 5)
 * @returns A sentiment category
 */
export function analyzeSentiment(score: number): SentimentCategory {
  return SENTIMENT_CATEGORIES.find(([threshold]) => score <= threshold)?.[1] ?? 'neutral';
}

/**
 * Gets an emoji representation based on the sentiment score
 *
 * @param score - The comparative sentiment score (can range from -5 to 5)
 * @returns An appropriate emoji
 */
const getSentimentEmoji = (score: number): string => {
  if (score <= -3) return '🤬';
  if (score <= -1.5) return '😡';
  if (score <= -0.5) return '😠';
  if (score <= -0.1) return '😕';
  if (score <= 0.1) return '😐';
  if (score <= 0.5) return '🙂';
  if (score <= 1.5) return '😊';
  if (score <= 3) return '😄';
  return '🥰';
};

/**
 * Format score with proper sign and up to 2 decimal places
 * Removes unnecessary zeros after decimal
 */
const formatScore = (score: number): string => {
  // Remove trailing zeros
  return (score >= 0 ? '+' : '') + score.toFixed(2).replace(/\.?0+$/, '');
};

/**
 * Generates a personalized message based on the user's sentiment analysis
 *
 * @param username - The username of the analyzed user
 * @param score - The raw comparative sentiment score (can range from -5 to 5)
 * @param postCount - The number of posts analyzed
 * @returns A friendly, personalized message about their sentiment
 */
export function generateSentimentResponse(username: string, score: number, postCount: number = 100): string {
  const sentiment = analyzeSentiment(score);
  const emoji = getSentimentEmoji(score);
  const formattedScore = formatScore(score);

  const responses = {
    'extremely negative': {
      message: `Yikes! Your posts have been giving off some serious storm clouds lately.`,
      detail: `Your sentiment score is ${formattedScore} (extremely negative).`,
      suggestion: `Want to try sprinkling in some positivity? It might brighten up your corner of the internet!`,
    },
    'very negative': {
      message: `Hmm, seems like you've been having some rough conversations recently.`,
      detail: `Your sentiment score is ${formattedScore} (very negative).`,
      suggestion: `A dash of kindness goes a long way - might be worth giving it a shot?`,
    },
    negative: {
      message: `Your recent posts have a bit of an edge to them.`,
      detail: `Your sentiment score is ${formattedScore} (negative).`,
      suggestion: `Try adding a positive comment for every critical one - it works wonders!`,
    },
    'slightly negative': {
      message: `You're leaning slightly toward the grumpy side of the internet.`,
      detail: `Your sentiment score is ${formattedScore} (slightly negative).`,
      suggestion: `You're almost at neutral territory - just a few kind words could tip the balance!`,
    },
    neutral: {
      message: `You're walking the middle path in your online conversations.`,
      detail: `Your sentiment score is ${formattedScore} (perfectly balanced).`,
      suggestion: `Neither overly critical nor excessively sweet - the Switzerland of Bluesky!`,
    },
    'slightly positive': {
      message: `There's a hint of sunshine in your recent posts!`,
      detail: `Your sentiment score is ${formattedScore} (slightly positive).`,
      suggestion: `That touch of positivity makes a difference - keep it up!`,
    },
    positive: {
      message: `Your posts have a genuinely warm vibe to them.`,
      detail: `Your sentiment score is ${formattedScore} (positive).`,
      suggestion: `Your energy is exactly what social media needs more of!`,
    },
    'very positive': {
      message: `Wow, you're radiating good vibes in your posts!`,
      detail: `Your sentiment score is ${formattedScore} (very positive).`,
      suggestion: `Whatever you're doing, it's working - your positivity is contagious!`,
    },
    'extremely positive': {
      message: `Are you made of sunshine?! Your posts are off-the-charts uplifting!`,
      detail: `Your sentiment score is ${formattedScore} (extremely positive).`,
      suggestion: `You're in rare air with this level of positivity - you must brighten everyone's day!`,
    },
  };

  const { message, detail, suggestion } = responses[sentiment];

  return `${emoji} Hey @${username}! ${message} ${detail} ${suggestion}`;
}
