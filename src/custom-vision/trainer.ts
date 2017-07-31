import { get, post } from 'superagent'
import { genBaseURL } from '../utils'
import { region, service, version } from './constants'
import * as types from './types'
import {
  Binary,
  CreateImageSummary,
  ImageIdCreateBatch,
  ImageTag,
  ImageUrlCreateBatch,
  TrainerConfig
} from './types'

export { types }

/** The Custom Vision API training handler. */
export class CustomVisionTrainer {
  /** The base URL for all prediction endpoints. */
  static baseURL = genBaseURL(region, service, version) + '/Training'

  /** The training key for the project */
  private trainingKey: string

  /** The project's ID */
  private projectID: string

  constructor({ trainingKey, projectID }: TrainerConfig) {
    this.trainingKey = trainingKey
    this.projectID = projectID
  }

  /**
   * Add images to the current project iteration given either their URLs or their binary data.
   *
   * @param images the images, either as URLs or as binary data.
   * @param tags the tag names to associate with all provided images.
   * @returns a summary of the action.
   */
  async addImages(
    images: Binary[] | string[],
    tags: string[]
  ): Promise<CreateImageSummary> {
    // determine if the images are URLs or raw data
    const binary = this.isBinaryArray(images)

    // create the correct endpoint
    const endpoint = binary ? 'image' : 'url'

    // build the request
    let req = post(this.genURL('images/' + endpoint)).set(
      'Training-Key',
      this.trainingKey
    )

    if (this.isBinaryArray(images)) {
      // add tags, and set the Content Type
      req = req.query({ tagIds: tags.join() }).type('multipart/form-data')

      // add each binary image to the request
      for (const image of images) {
        req.attach('image', image)
      }

      return (await req).body
    } else {
      const createBatch: ImageUrlCreateBatch = { Urls: images, TagIds: tags }
      return (await req.send(createBatch)).body
    }
  }

  /**
   * Add images to the current project iteration from past predictions.
   *
   * @param images the prediction image IDs to add.
   * @param tags the tag IDs to add.
   * @returns a summary of the action.
   */
  async addPredictionImages(
    images: string[],
    tags: string[]
  ): Promise<CreateImageSummary> {
    const createBatch: ImageIdCreateBatch = { Ids: images, TagIds: tags }
    return (await post(this.genURL('images/predictions'))
      .set('Training-Key', this.trainingKey)
      .send(createBatch)).body
  }

  /**
   * Create a new tag.
   * 
   * @param name the name of the tag to create.
   * @param description the description of the tag.
   * @returns the created tag's details.
   */
  async createTag(name: string, description = ''): Promise<ImageTag> {
    return (await post(this.genURL('tags'))
      .set('Training-Key', this.trainingKey)
      .query({ name, description })).body
  }

  /**
   * Get all tags associated with a project iteration.
   * 
   * @param iterationId the ID of the iteration to use.
   * @returns the tags' details.
   */
  async getTags(iterationId?: string) {
    return (await get(this.genURL('tags')).set(
      'Training-Key',
      this.trainingKey
    )).body
  }

  /**
   * Generate a URL with the project ID and a given endpoint.
   *
   * @param endpoint the endpoint to use in the URL.
   * @returns the generated URL.
   */
  private genURL(endpoint: string) {
    return `${CustomVisionTrainer.baseURL}/projects/${this
      .projectID}/${endpoint}`
  }

  /**
   * A simple Binary array type guard.
   * 
   * @param arg the argument to check.
   * @returns whether or not the array contains Binary data.
   */
  private isBinaryArray(arg: any): arg is Binary[] {
    return (
      arg instanceof Array &&
      (arg[0].constructor === Blob || arg[0].constructor === Buffer)
    )
  }
}
