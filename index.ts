import 'dotenv/config';
import { Bot } from '@skyware/bot';
import Sentiment from 'sentiment';

const username = process.env.BLUESKY_USERNAME;
const password = process.env.BLUESKY_PASSWORD;

if (!username || !password) throw new Error('BLUESKY_USERNAME and BLUESKY_PASSWORD must be set');

const SENTIMENT_CATEGORIES = [
  [-0.5, 'very mean'],
  [0, 'mean'],
  [0.1, 'neutral'],
  [0.5, 'nice'],
  [Infinity, 'very nice'],
] as const;

type SentimentCategory = (typeof SENTIMENT_CATEGORIES)[number][1];

const sentimentAnalyzer = new Sentiment();

/**
 * Analyzes an array of strings and returns a human-readable sentiment category
 *
 * @param texts - Array of strings to analyze
 * @param options - Optional configuration for sentiment analysis
 * @returns A sentiment category describing the overall tone
 */
export function analyzeSentiment(
  texts: string[],
  options?: {
    language?: string;
    extras?: Record<string, number>;
  },
): SentimentCategory {
  // Calculate the average comparative score using functional approach
  const averageComparative =
    texts.length > 0
      ? texts.map((text) => sentimentAnalyzer.analyze(text, options).comparative).reduce((sum, score) => sum + score, 0) /
        texts.length
      : 0;

  // Map the comparative score to a human-readable category using find
  return SENTIMENT_CATEGORIES.find(([threshold]) => averageComparative <= threshold)?.[1] ?? 'neutral';
}

/**
 * Generates a personalized message based on the user's sentiment analysis
 *
 * @param username - The username of the analyzed user
 * @param sentiment - The sentiment category from the analyzer
 * @param postCount - The number of posts analyzed
 * @returns A friendly, personalized message about their sentiment
 */
export function generateSentimentResponse(username: string, sentiment: SentimentCategory, postCount: number = 100): string {
  const responses = {
    'very mean': {
      message: `Based on your recent ${postCount} posts, your communication tends to be quite negative. Consider how your words might be received by others.`,
      suggestion: 'Adding some positive comments or constructive feedback could help balance your tone.',
      emoji: '😡',
    },
    mean: {
      message: `After analyzing your last ${postCount} posts, we've noticed a slightly negative tone in your communication.`,
      suggestion: 'A few positive words can go a long way in how your messages are perceived.',
      emoji: '🙁',
    },
    neutral: {
      message: `Your recent ${postCount} posts show a balanced communication style - neither overly positive nor negative.`,
      suggestion: 'Your measured approach to discussions is appreciated in online communities.',
      emoji: '😐',
    },
    nice: {
      message: `Analysis of your ${postCount} recent posts shows you tend to be positive in your communications.`,
      suggestion: 'Your constructive approach helps create a welcoming environment.',
      emoji: '🙂',
    },
    'very nice': {
      message: `Wow! Your last ${postCount} posts show consistently positive and supportive communication.`,
      suggestion: 'Your positive attitude makes the community a better place for everyone.',
      emoji: '😄',
    },
  };

  const { message, suggestion, emoji } = responses[sentiment];

  return `${emoji} Hey @${username}! ${message} ${suggestion}`;
}

const main = async () => {
  const bot = new Bot();

  await bot.login({
    identifier: username,
    password: password,
  });

  bot.on('error', (error) => {
    console.error(`error: ${error}`);
  });

  console.info(`bot logged in as ${username}`);

  bot.on('mention', async (mention) => {
    const user = mention.author.handle;
    console.info(`analyzing user ${user}`);

    // fetch the user's last 100 posts
    const posts = await bot
      .getUserPosts(user, {
        limit: 100,
      })
      .then((res) => res.posts);

    // var result = sentiment.analyze('Cats are stupid.');
    const userSentiment = analyzeSentiment(posts.map((post) => post.text));

    await mention.reply(
      {
        text: generateSentimentResponse(user, userSentiment, 100),
      },
      { resolveFacets: true },
    );
  });
};

main().catch(console.error);
