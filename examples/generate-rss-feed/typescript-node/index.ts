// Load the RssApp SDK
import RssApp, { RssAppFeed } from '../../../lib';
import env from 'dotenv';

env.config();

// Create RssApp service object
const rssApp = new RssApp({ apiKey: process.env.RSS_APP_API_KEY, apiSecret: process.env.RSS_APP_API_SECRET });

// Call RssApp to create the feed
rssApp.feed
  .create({ url: 'https://bbc.com' })
  .then((feed: RssAppFeed) => {
    console.log('Success', feed);
  })
  .catch((err) => {
    console.log('Error', err);
  });

// Call RssApp to list the feeds
rssApp.feed
  .list({ limit: 10, offset: 0 })
  .then((feeds: Array<RssAppFeed>) => {
    console.log('Success', feeds);
  })
  .catch((err) => {
    console.log('Error', err);
  });
