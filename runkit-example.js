// Load the RssApp SDK
const RssApp = require('rss-generator-api');
// Create RssApp service object
const rssApp = new RssApp({
  apiKey: 'c_...',
  apiSecret: 's_...',
});

// Call RssApp to create the feed
rssApp.feed
  .create({ url: 'https://bbc.com' })
  .then((feed) => {
    console.log('Success', feed);
  })
  .catch((err) => {
    console.log('Error', err);
  });

// Call RssApp to list the feeds
rssApp.feed
  .list({ limit: 10, offset: 0 })
  .then((list) => {
    console.log('Success', list.data);
  })
  .catch((err) => {
    console.log('Error', err);
  });
