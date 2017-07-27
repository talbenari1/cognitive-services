import { prediction } from './prediction'
import { training } from './training'
import * as types from './types'

export { types }

export const customVision = (config: types.Config) => {
  return {
    prediction: prediction(config),
    training: training(config)
  }
}
