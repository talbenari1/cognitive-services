import { get } from 'superagent'
import { SafeSearch } from '../types'
import { genBaseURL } from '../utils'
import { service, version } from './constants'
import { Config, Entity, SearchResponse } from './types'

/** The entity search handler. */
export class EntitySearch {
  /** The base URL for all endpoints */
  static baseURL = genBaseURL(null, service, version)

  /** The primary API key associated with the account. */
  private APIKey: string

  constructor({ APIKey }: Config) {
    this.APIKey = APIKey
  }

  /**
   * Get entities and places results for a given query.
   * @param query the search query.
   * @param count the number of entities to return.
   * @param offset the number of entities to skip before returning results.
   * @param safeSearch whether or not to filter the results for adult content.
   * @returns the search results.
   */
  async search(
    query: string,
    count = 10,
    offset = 0,
    safeSearch: SafeSearch = 'Strict'
  ): Promise<SearchResponse> {
    return (await get(EntitySearch.baseURL + '/entities')
      .set('Ocp-Apim-Subscription-Key', this.APIKey)
      .query({ q: query, count, offset, safeSearch })).body
  }
}
