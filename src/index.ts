import { bing } from './bing'
import { customVision } from './custom-vision'
import * as types from './types'

export const sdk = (config: types.Config) => {
  return {
    customVision: config.customVision && customVision(config.customVision),
    bing: config.bing && bing(config.bing)
  }
}

export { types }
