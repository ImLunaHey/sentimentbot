import Sentiment from 'sentiment';

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

type SentimentCategory =
  | 'extremely negative'
  | 'very negative'
  | 'negative'
  | 'slightly negative'
  | 'neutral'
  | 'slightly positive'
  | 'positive'
  | 'very positive'
  | 'extremely positive';

/**
 * Analyzes a sentiment score and returns a sentiment category
 *
 * @param score - The comparative sentiment score (can range from -5 to 5)
 * @returns A sentiment category
 */
export function analyzeSentiment(score: number): SentimentCategory {
  if (score === 0) return 'neutral';
  if (score < 0) {
    if (score <= -3) return 'extremely negative';
    if (score <= -1.5) return 'very negative';
    if (score <= -0.5) return 'negative';
    return 'slightly negative';
  } else {
    if (score <= 0.5) return 'slightly positive';
    if (score <= 1.5) return 'positive';
    if (score <= 3) return 'very positive';
    return 'extremely positive';
  }
}

/**
 * Gets an emoji representation based on the sentiment score
 *
 * @param score - The comparative sentiment score (can range from -5 to 5)
 * @returns An appropriate emoji
 */
const getSentimentEmoji = (score: number): string => {
  if (score === 0) return '😐';
  if (score < 0) {
    if (score <= -3) return '🤬';
    if (score <= -1.5) return '😡';
    if (score <= -0.5) return '😠';
    return '😕';
  } else {
    if (score <= 0.1) return '🙂';
    if (score <= 0.5) return '😌';
    if (score <= 1.5) return '😊';
    if (score <= 3) return '😄';
    return '🥰';
  }
};

// Neutral (0)
const neutral = [
  'Your vibe is pretty neutral right now.',
  "You're keeping it balanced in your conversations.",
  'Not leaning positive or negative - just keeping it real.',
  "You're in the neutral zone with your messaging.",
  'Your posts are giving very middle-of-the-road energy.',
  "You're neither a downer nor a hype machine right now.",
  'Your messages are about as neutral as they come.',
];

// Slightly negative (-0.1 to -0.5)
const slightlyNegative = [
  "There's a bit of an edge to your recent posts.",
  'You seem slightly annoyed in your conversations.',
  "Your tone's got a tiny bite to it lately.",
  "You're giving off some minor irritation vibes.",
  'Your messages have a subtle hint of frustration.',
  "You're keeping it real, maybe a little too real.",
  "There's a dash of salt in your recent comments.",
  "You're not exactly feeling the warm fuzzies right now.",
];

// Moderately negative (-0.5 to -1.5)
const moderatelyNegative = [
  "You're not holding back the negativity lately.",
  'Your posts are giving off some serious side-eye.',
  'You seem pretty fed up in your recent messages.',
  "You're definitely in a mood based on these posts.",
  'Your patience seems to be wearing thin.',
  "You're not exactly spreading the joy right now.",
  "Your messages suggest you're having a rough time.",
  'The frustration is coming through loud and clear.',
];

// Very negative (-1.5 to -3)
const veryNegative = [
  'Your posts are radiating some serious negativity.',
  "You're not mincing words about how you feel. And it's not great.",
  "You're in a proper funk based on these messages.",
  "Your messages are giving major 'stay away' energy.",
  "You're really letting your dark side show in these posts.",
  'Your conversations are dripping with hostility lately.',
  "You're throwing some serious shade in your messaging.",
  "These posts suggest you're having a genuinely awful time.",
];

// Extremely negative (below -3)
const extremelyNegative = [
  'Your posts are nuclear-level negative right now.',
  'Damn, who hurt you? Your messages are brutal.',
  "You're on a rampage with these comments.",
  'Your posts are absolutely scorching the earth.',
  'These messages could make a therapist wince.',
  "You're not just burning bridges, you're obliterating them.",
  'Your negativity meter is completely maxed out.',
  'You might want to step away from the keyboard for a bit.',
];

// Slightly positive (0.1 to 0.5)
const slightlyPositive = [
  "There's a hint of positivity in your posts.",
  "You're giving off subtle good vibes.",
  'Your messages have a slight upbeat tone to them.',
  'You seem to be in a decent mood in your posts.',
  "There's a gentle optimism in your messages.",
  "You're leaning slightly toward the bright side.",
  'Your posts have a minor positive spin to them.',
  "You're keeping things just a little sunny in your messages.",
];

// Moderately positive (0.5 to 1.5)
const moderatelyPositive = [
  "You've got some genuinely good energy in your posts.",
  'Your messages are giving off solid positive vibes.',
  'You seem to be in a pretty good headspace right now.',
  'Your positivity is definitely coming through.',
  "You're bringing some welcome warmth to conversations.",
  'Your posts have a refreshingly upbeat quality.',
  "You're spreading good vibes without overdoing it.",
  "There's an authentic brightness to your messages.",
];

// Very positive (1.5 to 3)
const veryPositive = [
  'Your posts are seriously uplifting to read.',
  "You're bringing major positive energy to these conversations.",
  "Your messages could brighten anyone's day.",
  "You're not just positive, you're inspiringly so.",
  'Your posts radiate genuine enthusiasm and warmth.',
  "You're on a real positivity streak in these messages.",
  'Your good vibes game is exceptionally strong right now.',
  "You're like a breath of fresh air in these conversations.",
];

// Extremely positive (above 3)
const extremelyPositive = [
  'Your posts are off-the-charts positive right now.',
  "You're basically a walking serotonin boost with these messages.",
  "Your positivity is almost suspiciously high. And I'm here for it.",
  'You must be having the best day ever based on these posts.',
  'Your optimism levels are through the roof.',
  "You're not just spreading positivity, you're weaponizing it.",
  'Your posts are making unicorns and rainbows seem cynical.',
  "Whatever you're on, I want some. Your positivity is unreal.",
];

const getRandomArrayItem = (array: string[]) => array[Math.floor(Math.random() * array.length)];

const getSentimentMessage = (score: number) => {
  if (score === 0) return getRandomArrayItem(neutral);

  if (score < 0) {
    if (score <= -3) return getRandomArrayItem(extremelyNegative);
    if (score <= -1.5) return getRandomArrayItem(veryNegative);
    if (score <= -0.5) return getRandomArrayItem(moderatelyNegative);
    return getRandomArrayItem(slightlyNegative);
  } else {
    if (score >= 3) return getRandomArrayItem(extremelyPositive);
    if (score >= 1.5) return getRandomArrayItem(veryPositive);
    if (score >= 0.5) return getRandomArrayItem(moderatelyPositive);
    return getRandomArrayItem(slightlyPositive);
  }
};

// Extremely negative suggestions (score <= -3)
const extremelyNegativeSuggestions = [
  'Whoa there - you might want to take a breath before sending that.',
  'Consider if this level of negativity is really getting your point across.',
  'Your posts are pretty harsh - maybe sleep on it before sending?',
  'Your frustration is clear, but a calmer approach might be more effective.',
  'Try focusing on solutions rather than just the problems.',
  'Your posts might burn bridges - is that what you really want?',
  'Consider if your tone matches how you want to be perceived online.',
  'Your critiques might be valid, but the delivery could use some work.',
  'Think about whether your posts will help or just escalate things.',
  'Maybe try reframing your concerns in a more constructive way.',
];

// Very negative suggestions (-3 < score <= -1.5)
const veryNegativeSuggestions = [
  'Your posts come across strongly negative - maybe soften it a bit?',
  'Consider adding some constructive suggestions along with your criticisms.',
  'This level of negativity might overshadow your actual points.',
  'Try acknowledging some positives before diving into the negatives.',
  'Your posts might be taken more seriously with a more measured tone.',
  'Consider if your posts will help resolve the situation or inflame it.',
  "You've made your dissatisfaction clear - now try offering solutions.",
  'Your posts might come across harsher than you intend.',
  'Try focusing on specific issues rather than general negativity.',
  'A more balanced approach might make people more receptive to your feedback.',
];

// Moderately negative suggestions (-1.5 < score <= -0.5)
const moderatelyNegativeSuggestions = [
  'Your posts lean negative - try balancing it with some positives.',
  'Consider whether your tone matches your intentions here.',
  'A little more optimism might make your posts more persuasive.',
  'Try framing your concerns as constructive feedback.',
  'Your skepticism comes through - maybe pair it with some encouragement?',
  'Consider adding some solutions along with pointing out problems.',
  "Your critical eye is valuable, but so is acknowledging what's working.",
  'Try sandwiching your criticism between positive observations.',
  'A slightly more upbeat tone might help get your message across.',
  'Consider if your posts might be interpreted as more negative than intended.',
];

// Slightly negative suggestions (-0.5 < score < 0)
const slightlyNegativeSuggestions = [
  'Your posts have a slight edge to it - a bit more positivity could help.',
  'Consider adding some encouraging words to balance out the tone.',
  'Try acknowledging the positives before getting into concerns.',
  'Your posts come across as a bit dismissive - maybe soften it?',
  'A slightly warmer tone might make your posts more effective.',
  'Consider whether this slight negativity is intentional or accidental.',
  'Try phrasing your concerns as questions instead of statements.',
  'Your posts have a subtle negative undertone - is that what you intended?',
  'A touch more enthusiasm could change how your posts are received.',
  'Consider if a more positive framing would better serve your purpose.',
];

// Neutral suggestions (score = 0)
const neutralSuggestions = [
  'Your posts are pretty neutral - try adding some personality.',
  'Show a bit more of your authentic feelings next time.',
  "Your tone is balanced, but don't be afraid to express more emotion.",
  'Consider adding more colour to your posts to stand out.',
  'Your neutrality is fine, but people connect more with emotional content.',
  'Try injecting some enthusiasm into your next post.',
  'Your posts are safe, but sometimes taking a stance connects better.',
  'Being neutral is fine, but showing passion can be more engaging.',
  'Consider whether your balanced approach is actually what you intend.',
  'A bit more expressiveness might make your posts more memorable.',
];

// Slightly positive suggestions (0 < score < 0.5)
const slightlyPositiveSuggestions = [
  'Keep up that positive energy in your posts! A bit more could really shine.',
  'Your posts have a nice optimistic feel - let it show even more!',
  'Love seeing those hints of positivity. Why not express it more openly?',
  'You seem to be in a good mood - share more of that with your followers!',
  "You're spreading some good vibes. Don't be shy about it!",
  'That subtle positivity in your posts is great. Let it out more!',
  'Nice to see you keeping things upbeat. Your followers probably appreciate it.',
  "You're bringing some light positivity - feel free to brighten it up more!",
  'Those positive posts are a good look on you. Keep that energy going!',
  'Your posts have a nice warm tone. Your followers might enjoy even more of that.',
];

// Moderately positive suggestions (0.5 <= score < 1.5)
const moderatelyPositiveSuggestions = [
  "You're spreading good vibes! Maybe share what specifically made you feel this way?",
  'Love your upbeat posts! Adding details about why could inspire others even more.',
  'Your optimism is contagious! Tell us more about what sparked this positivity.',
  "You're clearly feeling great! Share the story behind that enthusiasm.",
  'Such a positive outlook! What specific moments led to these good feelings?',
  'Your cheerful posts brighten the feed! What exactly has you so pumped?',
  "You're radiating happiness! Let's hear the details that got you there.",
  'Loving this positive energy! Paint us a picture of what inspired it.',
  "You're in such a great headspace! Share those little wins with us.",
  'Your posts are a ray of sunshine! Tell us more about these happy moments.',
];

// Very positive suggestions (1.5 <= score < 3)
const veryPositiveSuggestions = [
  'Your posts are super positive! Maybe share what specifically got you so excited?',
  'Loving your enthusiastic posts! Adding some details would make them even better.',
  'Your feed is full of great vibes! Tell us more about what made your day.',
  "You're spreading so much positivity! Share the story behind all this joy.",
  'Such uplifting posts! What awesome things happened to inspire this?',
  'Your posts are radiating happiness! Let us know what got you feeling this way.',
  "You're in an amazing mood! Give us the highlights that led to this.",
  'Your positivity is infectious! Share those moments that made you smile.',
  "You're really lighting up the timeline! What's got you so pumped?",
  'Love seeing you this happy! Tell everyone what sparked all this good energy.',
];

// Extremely positive suggestions (score >= 3)
const extremelyPositiveSuggestions = [
  'Your incredible enthusiasm is contagious! Share what amazing things led to this joy!',
  'Wow, your positivity is through the roof! Tell us the story behind this excitement!',
  'Your posts are absolutely glowing with happiness! What wonderful things happened?',
  'Such amazing energy in your posts! Share those fantastic moments with everyone!',
  'Your joy is lighting up the timeline! Tell us what has you feeling so fantastic!',
  'Love seeing this boundless optimism! What incredible things got you here?',
  'Your posts are pure sunshine today! Share those amazing experiences!',
  'This enthusiasm is infectious! Let everyone know what sparked such joy!',
  'Your positivity is absolutely radiant! Tell us about these wonderful moments!',
  'Such incredible positive energy! Share the amazing story behind these good vibes!',
];

const getSentimentSuggestion = (score) => {
  if (score === 0) {
    return neutralSuggestions;
  } else if (score < 0) {
    if (score <= -3) return getRandomArrayItem(extremelyNegativeSuggestions);
    if (score <= -1.5) return getRandomArrayItem(veryNegativeSuggestions);
    if (score <= -0.5) return getRandomArrayItem(moderatelyNegativeSuggestions);
    return getRandomArrayItem(slightlyNegativeSuggestions);
  } else {
    if (score >= 3) return getRandomArrayItem(extremelyPositiveSuggestions);
    if (score >= 1.5) return getRandomArrayItem(veryPositiveSuggestions);
    if (score >= 0.5) return getRandomArrayItem(moderatelyPositiveSuggestions);
    return getRandomArrayItem(slightlyPositiveSuggestions);
  }
};

/**
 * Generates a personalized message based on the user's sentiment analysis
 *
 * @param username - The username of the analyzed user
 * @param score - The raw comparative sentiment score (can range from -5 to 5)
 * @param postCount - The number of posts analyzed
 * @returns A friendly, personalized message about their sentiment
 */
export function generateSentimentResponse(username: string, score: number): string {
  const sentiment = analyzeSentiment(score);
  const emoji = getSentimentEmoji(score);
  const message = getSentimentMessage(score);
  const suggestion = getSentimentSuggestion(score);
  const formattedScore = score.toFixed(2);

  return `${emoji} Hey @${username}! ${message} Your sentiment score is ${formattedScore} (${sentiment}). ${suggestion}`;
}
