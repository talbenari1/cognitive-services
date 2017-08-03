import { get } from 'superagent'
import { genBaseURL } from '../utils'
import { service, version } from './constants'
import { Config, ImageResults, Market, SafeSearch } from './types'

/** The image search handler. */
export class ImageSearch {
  /** The base URL for all endpoints */
  static baseURL = genBaseURL(null, service, version)

  /** The primary API key associated with the account. */
  private APIKey: string

  constructor({ APIKey }: Config) {
    this.APIKey = APIKey
  }

  /**
   * Search the web for images.
   * @param query the search query.
   * @param count the number of images to return.
   * @param offset the number of images to skip before returning results.
   * @param mkt the market where the results should come from.
   * @param safeSearch whether or not to filter the results for adult content.
   * @returns the search results.
   */
  async search(
    query: string,
    count = 10,
    offset = 0,
    market: Market = 'en-US',
    safeSearch: SafeSearch = 'Strict'
  ): Promise<ImageResults> {
    return (await get(this.genURL('search'))
      .set('Ocp-Apim-Subscription-Key', this.APIKey)
      .query({ q: query, count, offset, mkt: market, safeSearch })).body
  }

  /**
   * Generate an API URL given an endpoint.
   * 
   * @param endpoint 
   * @returns the generated URL.
   */
  private genURL(endpoint: string) {
    return ImageSearch.baseURL + '/images/' + endpoint
  }
}
