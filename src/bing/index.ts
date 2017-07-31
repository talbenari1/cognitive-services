import { ImageSearch } from './images'
import * as types from './types'
import { Config } from './types'

export { types }

/** The Bing API account manager. */
export class Bing {
  /** The rate limit (Hz) across all Bing Search APIs on a free account. */
  static BING_LIMIT = 7

  /** The image search handler for this account. */
  public images: ImageSearch

  /** The primary API key associated with the account. */
  private APIKey: string

  constructor({ APIKey }: Config) {
    this.APIKey = APIKey
    this.images = new ImageSearch({ APIKey })
  }
}
