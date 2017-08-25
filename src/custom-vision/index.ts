import { get, post } from 'superagent'
import { genBaseURL } from '../utils'
import { region, service, version } from './constants'
import { CustomVisionPredictor } from './predictor'
import { CustomVisionTrainer } from './trainer'
import * as types from './types'
import { Account, Config, Domain, PredictorConfig, Project } from './types'

export { types }

/** The Custom Vision API account manager. */
export class CustomVision {
  /** The base URL for all endpoints. */
  static baseURL = genBaseURL(region, service, version) + '/Training'

  /** The active project's ID */
  readonly projectID?: string

  /** The active project's training handler. */
  private _trainer?: CustomVisionTrainer

  /** The active project's prediction handler. */
  private _predictor?: CustomVisionPredictor

  /** The primary training key associated with the account. */
  private trainingKey: string

  /** The primary prediction key associated with the account. */
  private predictionKey?: string

  /** The account information. */
  private accountInfo?: Account

  /** All available domains in Custom Vision. */
  private domains?: Domain[]

  constructor({ trainingKey, predictionKey, projectID }: Config) {
    this.trainingKey = trainingKey
    if (predictionKey) this.predictionKey = predictionKey

    if (projectID) {
      this.setProject(projectID)
      void (async () => {
        if (!predictionKey) {
          const info = await this.getAccountInfo()
          predictionKey = info.Keys.PredictionKeys.PrimaryKey
        }
      })()
    }
  }

  get trainer() {
    if (!this._trainer) {
      throw new Error('')
    }

    return this._trainer
  }

  /**
   * Create a new project.
   *
   * @param name the name of the project to create.
   * @param description the description of the project.
   * @param domain the name of the domain to use.
   * @returns the created project's details.
   */
  async createProject(
    name: string,
    description: string,
    domain = 'General'
  ): Promise<Project> {
    const project: Project = (await post(CustomVision.baseURL + '/projects')
      .set('Training-Key', this.trainingKey)
      .query({
        description,
        domainId: (await this.findDomain(domain)).Id || '',
        name
      })).body

    this.setProject(project.Id)

    return project
  }

  /**
   * Get a domain object given its name.
   *
   * @param name the domain name.
   * @returns the domain's details.
   */
  async findDomain(name: string): Promise<Domain> {
    const domain = (await this.getDomains()).find(el => el.Name === name)
    if (!domain) throw new Error(`Domain not found: ${name}`)
    return domain
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
   * Retrieve and save the prediction key for the account.
   */
  async retrievePredictionKey(): Promise<void> {
    if (!this.predictionKey) {
      this.predictionKey = (await this.getAccountInfo()).Keys.PredictionKeys.PrimaryKey
      if (this.projectID) this.setProject(this.projectID)
    }
  }

  /**
   * Get all projects associated with the account.
   * 
   * @returns the projects' details.
   */
  async getProjects(): Promise<Project[]> {
    return (await get(CustomVision.baseURL + '/projects').set(
      'Training-Key',
      this.trainingKey
    )).body
  }

  /**
   * Set the current active project.
   * 
   * @param projectID the ID of the project to make active.
   */
  setProject(projectID: string): void {
    if (!(this._trainer && this._trainer.projectID === projectID)) {
      this._trainer = new CustomVisionTrainer({
        trainingKey: this.trainingKey,
        projectID
      })
    }
    if (
      this.predictionKey &&
      !(this._predictor && this._predictor.projectID === projectID)
    ) {
      this._predictor = new CustomVisionPredictor({
        predictionKey: this.predictionKey,
        projectID
      })
    }
  }
}

/**
 * Create a Custom Vision handler.
 * @param config the configuration object.
 * @returns the created handler.
 */
function factory(config: PredictorConfig): CustomVisionPredictor
function factory(config: Config): CustomVision
function factory(config: PredictorConfig | Config) {
  return isFullConfig(config)
    ? new CustomVision(config)
    : new CustomVisionPredictor(config)
}

/**
 * Determine if the config is a full config or only for predictions.
 * @param config the config object to test.
 * @returns a type predicate guaranteeing the config's type.
 */
function isFullConfig(config: any): config is Config {
  return config.hasOwnProperty('trainingKey')
}

export default factory
