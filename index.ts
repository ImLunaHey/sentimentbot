import 'dotenv/config';
import { Bot } from '@skyware/bot';
import { analyzeSentiment, analyzeSentimentScore, generateSentimentResponse } from './sentiment';

const username = process.env.BLUESKY_USERNAME;
const password = process.env.BLUESKY_PASSWORD;

if (!username || !password) throw new Error('BLUESKY_USERNAME and BLUESKY_PASSWORD must be set');

const bot = new Bot();

const main = async () => {
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
    try {
      console.info(`analyzing user ${user}`);

      // fetch the user's profile
      const profile = await bot.getProfile(user);
      const did = profile.did;

      // fetch the user's repo
      const repo = await fetch(`https://plc.directory/${did}`).then(
        (response) => response.json() as Promise<{ service: { id: string; serviceEndpoint: string }[] }>,
      );

      // get the pds url
      const pdsUrl = repo.service?.find((service) => service.id === '#atproto_pds')?.serviceEndpoint;

      // fetch the user's last 100 posts
      const response = await fetch(
        `${pdsUrl}/xrpc/com.atproto.repo.listRecords?collection=app.bsky.feed.post&repo=${user}&limit=100`,
      ).then((response) => response.json() as Promise<{ records: { value: unknown }[] }>);
      const records = response.records.map((record) => record.value);

      const posts = records.map((record) =>
        typeof record === 'object' &&
        record !== null &&
        Object.keys(record).includes('text') &&
        typeof (record as { text: unknown }).text === 'string'
          ? (record as { text: string }).text
          : '',
      );

      const score = analyzeSentimentScore(posts);
      const userSentiment = analyzeSentiment(score);

      console.info(`${user} has a sentiment score of ${score} (${userSentiment})`);

      await mention.reply(
        {
          text: generateSentimentResponse(user, score),
        },
        { resolveFacets: true },
      );
    } catch (error) {
      console.error(`error analyzing user ${user}: ${error}`);
      await mention
        .reply(
          {
            text: `Sorry @${user}, I hit an error while analyzing your sentiment. This is a bug, and the creator has been notified.`,
          },
          { resolveFacets: true },
        )
        .catch((err) => {
          console.error(`error replying to user ${user}: ${err}`);
        });
    }
  });
};

main().catch(console.error);
