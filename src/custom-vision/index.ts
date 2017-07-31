import { get, post } from 'superagent'
import { genBaseURL } from '../utils'
import { region, service, version } from './constants'
import { CustomVisionPredictor } from './predictor'
import { CustomVisionTrainer } from './trainer'
import * as types from './types'
import { Account, Config, Domain, Project } from './types'

export { types }

/** The Custom Vision API account manager. */
export class CustomVision {
  /** The base URL for all endpoints. */
  static baseURL = genBaseURL(region, service, version) + '/Training'

  /** The active project's training handler. */
  trainer?: CustomVisionTrainer
  
  /** The primary training key associated with the account. */
  private trainingKey: string

  /** The primary prediction key associated with the account. */
  private predictionKey?: string

  /** The active project's prediction handler. */
  private predictor?: CustomVisionPredictor

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
        this.predictor = new CustomVisionPredictor({ predictionKey, projectID })
      })()
    }
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
    const domain = (await this.getDomains()).find(
      (el: Domain) => el.Name === name
    )
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

  /** The predict method, pulled from the predictor for easier access. */
  get predict() {
    if (!this.predictor) {
      throw new Error('No project ID provided')
    }

    return this.predictor.predict
  }

  /**
   * Set the current active project.
   * 
   * @param projectID the ID of the project to make active.
   */
  setProject(projectID: string) {
    this.trainer = new CustomVisionTrainer({
      trainingKey: this.trainingKey,
      projectID
    })
  }
}
