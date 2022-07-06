import RssApp from '../src';

let rssApp: RssApp;
const feedId = '5BBHs2TBCBchqBmb';

describe('Testing Feed Apis', () => {
  beforeAll(() => {
    rssApp = new RssApp({
      apiKey: process.env.RSS_APP_API_KEY as string,
      apiSecret: process.env.RSS_APP_API_SECRET as string,
    });
  });
  test('Get one feed', async () => {
    const feed = await rssApp.feed.get(feedId);
    expect(feed.id).toBe(feedId);
  });
  test('Create feed from bbc.com', async () => {
    const feed = await rssApp.feed.create({ url: 'https://www.bbc.com' });
    expect(feed.source.url).toBe('https://www.bbc.com');
  });
  test('List feeds', async () => {
    const feeds = await rssApp.feed.list({ limit: 5 });
    expect(feeds.limit).toBe(5);
    expect(feeds.data[0].id).not.toBeNull();
  });
  test('Delete feed', async () => {
    try {
      await rssApp.feed.delete(feedId);
    } catch (error) {
      expect((error as any).response.errors[0].code).toBe('DEMO_API_KEY_RESTRICTED');
    }
  });
});
