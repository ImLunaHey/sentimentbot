# sentimentbot

A Bluesky bot. Mention it and it fetches your last 100 posts straight
from your PDS, runs them through AFINN sentiment analysis (via the
`sentiment` npm package), and replies with a comparative score and
category — anything from "extremely negative" to "extremely positive".

## Run it

```bash
npm install
BLUESKY_USERNAME=…  BLUESKY_PASSWORD=…  npm start
```

## How it works

- `@skyware/bot` listens for mentions
- The bot resolves the mentioner's DID → PDS via `plc.directory`, then
  hits `com.atproto.repo.listRecords` directly on their PDS for posts
- Each post text is scored via AFINN; the average comparative score is
  bucketed into a category
- The reply quotes the score and category back to the user
