import { get } from 'superagent'
import { genBaseURL } from '../utils'
import { region, service, version } from './constants'
import { CustomVisionPredictor } from './predictor'
import * as types from './types'

export { types }

/** The Custom Vision API account manager. */
export class CustomVision {
  /** The base URL for all endpoints. */
  static baseURL = genBaseURL(region, service, version) + '/Training'

  /** The training key associated with the account. */
  private trainingKey: string

  /** The prediction key associated with the account. */
  private predictionKey: string | undefined

  /** The active project. */
  private predictor: CustomVisionPredictor | undefined

  /** The account information */
  private accountInfo: types.Account | undefined

  constructor({ trainingKey, predictionKey, projectID }: types.Config) {
    this.trainingKey = trainingKey
    if (predictionKey) this.predictionKey = predictionKey

    if (projectID) {
      void (async () => {
        if (!predictionKey) {
          const info = await this.getAccountInfo()
          predictionKey = info.Keys.PredictionKeys.PrimaryKey
        }
        this.predictor = new CustomVisionPredictor({ predictionKey, projectID })
      })()
    }
  }

  /**
   * Get the account's information.
   * 
   * @returns the account info.
   */
  async getAccountInfo(): Promise<types.Account> {
    if (!this.accountInfo) {
      this.accountInfo = (await get(CustomVision.baseURL + '/account').set(
        'Training-key',
        this.trainingKey
      )).body as types.Account
    }

    return this.accountInfo
  }
}
