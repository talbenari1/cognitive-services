import { get } from 'superagent'
import { genBaseURL } from '../utils'
import { region, service, version } from './constants'
import { CustomVisionPredictor } from './predictor'
import * as types from './types'
import { Account, Config, Domain } from './types'

export { types }

/** The Custom Vision API account manager. */
export class CustomVision {
  /** The base URL for all endpoints. */
  static baseURL = genBaseURL(region, service, version) + '/Training'

  /** The primary training key associated with the account. */
  private trainingKey: string

  /** The primary prediction key associated with the account. */
  private predictionKey?: string

  /** The active project. */
  private predictor?: CustomVisionPredictor

  /** The account information. */
  private accountInfo?: Account

  /** All available domains in Custom Vision. */
  private domains?: Domain[]

  constructor({ trainingKey, predictionKey, projectID }: Config) {
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

  /** The predict method, pulled from the predictor for easier access. */
  get predict() {
    if (!this.predictor) {
      throw new Error('No project ID provided')
    }

    return this.predictor.predict
  }

  /**
   * Get the account's information.
   * 
   * @returns the account info.
   */
  async getAccountInfo(): Promise<Account> {
    if (!this.accountInfo) {
      this.accountInfo = (await get(CustomVision.baseURL + '/account').set(
        'Training-key',
        this.trainingKey
      )).body as Account
    }

    return this.accountInfo
  }

  /**
   * Get a list of all available domains.
   * 
   * @param force whether or not to force the function to re-fetch the info, disabling memoization.
   * @returns the list of domains.
   */
  async getDomains(force = false): Promise<Domain[]> {
    if (force || !this.domains) {
      this.domains = (await get(CustomVision.baseURL + '/domains').set(
        'Training-Key',
        this.trainingKey
      )).body as Domain[]
    }

    return this.domains
  }

  /**
   * Get a domain object given its name.
   *
   * @param name the domain name.
   * @returns the domain's details.
   */
  async findDomain(name: string): Promise<Domain> {
    const domain = (await this.getDomains()).find(
      (el: Domain) => el.Name === name
    )
    if (!domain) throw new Error(`Domain not found: ${name}`)
    return domain
  }
}
