import { images } from './images'
import * as types from './types'

export { types }

export const bing = (config: types.Config) => {
  return {
    images: images(config)
  }
}
