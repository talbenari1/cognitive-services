import { genBaseURL } from '../utils'
import { get } from 'superagent'
import { service, version } from './constants'
import { Config, Market } from './types'

const baseURL = genBaseURL(null, service, version)
const genURL = (endpoint: string) => baseURL + '/images/' + endpoint

export const images = ({ APIKey }: Config) => {
  /**
   * Search the web for images.
   * @param query the search query.
   * @param count the number of images to return.
   * @param offset the number of images to skip before returning results.
   * @param mkt the market where the results should come from.
   * @param safeSearch whether or not to filter the results for adult content.
   * @returns the search results.
   */
  const search = async (
    query: string,
    count = 10,
    offset = 0,
    market: Market = 'en-US',
    safeSearch = true
  ) =>
    (await get(genURL('search'))
      .set('Ocp-Apim-Subscription-Key', APIKey)
      .query({ q: query, count, offset, mkt: market, safeSearch })).body

  return { search }
}
