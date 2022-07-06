import fetch from 'cross-fetch';
import {
  CreateFeedOptions,
  ERssAppRequestMethod,
  RssAppFeed,
  MakeRequestOptions,
  RssAppApi,
  RssAppCredentials,
  RssAppListOptions,
  RssAppOptions,
  RssAppFeedList,
  RssAppError,
} from './types';

const DEFAULT_HOST = 'https://api.rss.app';
const DEFAULT_BASE_PATH = '/api/v1/';

class RssApp {
  private _credentials: RssAppCredentials;
  private _api: RssAppApi;

  /**
   *
   * @param credentials - API key and API secret
   * @param options
   *
   * @see {@link https://rss.app/docs/api/authentication | Authentication Documentation}
   */
  constructor(credentials: RssAppCredentials, options?: RssAppOptions) {
    this._credentials = credentials;
    this._api = {
      host: options?.host || DEFAULT_HOST,
      protocol: options?.protocol || 'https',
      basePath: DEFAULT_BASE_PATH,
    };
  }

  public feed = {
    /**
     * Returns a list of feeds in the account.
     *
     * @param options - Limit and offset options
     * @returns Promise<Feed[]>
     *
     * @see {@link https://rss.app/docs/api/feed/list | List Feed Documentation}
     */
    list: (options?: RssAppListOptions): Promise<RssAppFeedList> => {
      return this._makeRequest({
        method: ERssAppRequestMethod.GET,
        path: 'feed',
        params: options && { $limit: options.limit, $offset: options.offset },
      });
    },
    /**
     * A feed is returned. Otherwise, an error is returned.
     *
     * @param feedId - Feed id
     * @returns Promise<Feed>
     *
     * @see {@link https://rss.app/docs/api/feed/get | Get Feed Documentation}
     */
    get: (feedId: string): Promise<RssAppFeed> => {
      return this._makeRequest({
        method: ERssAppRequestMethod.GET,
        path: `feed/${feedId}`,
      });
    },
    /**
     * A feed with posts is returned. Otherwise, an error is returned.
     *
     * @param createFeedOptions - A valid website URL is required
     * @returns Promise<Feed>
     *
     * @example https://bbc.com
     *
     * @see {@link https://rss.app/docs/api/feed/create | Create Feed Documentation}
     */
    create: (createFeedOptions: CreateFeedOptions): Promise<RssAppFeed> => {
      return this._makeRequest({
        method: ERssAppRequestMethod.POST,
        path: `feed`,
        body: createFeedOptions,
      });
    },
    /**
     * A feed with posts is returned. Otherwise, an error is returned.
     *
     * @param feedId - Feed id
     * @returns Promise<{ id: string; deleted: boolean }>
     *
     * @see {@link https://rss.app/docs/api/feed/delete | Delete Feed Documentation}
     */
    delete: (feedId: string): Promise<{ id: string; deleted: boolean }> => {
      return this._makeRequest({
        method: ERssAppRequestMethod.DELETE,
        path: `feed/${feedId}`,
      });
    },
  };

  private _getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this._credentials.apiKey}:${this._credentials.apiSecret}`,
    };
  }

  private _getUrl(path: string, queryParams: { [key: string]: string }): URL {
    const url = new URL(`${this._api.host}${this._api.basePath}${path}`);
    for (const k in queryParams) {
      if (queryParams.hasOwnProperty(k)) {
        url.searchParams.append(k, queryParams[k]);
      }
    }
    return url;
  }

  private _makeRequest(options: MakeRequestOptions) {
    return fetch(this._getUrl(options.path, options.params), {
      method: options.method,
      headers: this._getHeaders(),
      body: options.body && JSON.stringify(options.body),
    }).then(async (response) => {
      if (!response.ok) {
        // create error object and reject if not a 2xx response code
        const err: RssAppError = new Error('HTTP status code: ' + response.status);
        err.response = await response.json();
        err.status = response.status;
        throw err;
      } else {
        return response.json();
      }
    });
  }
}

export { RssAppCredentials, RssAppOptions, RssAppListOptions, CreateFeedOptions, RssAppFeed, RssAppFeedList };
export default RssApp;

module.exports = RssApp;
module.exports.default = RssApp;
module.exports.RssApp = RssApp;
