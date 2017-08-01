import { post } from 'superagent'
import { genBaseURL } from '../utils'
import { region, service, version } from './constants'
import { Binary, ImagePredictionResult, PredictorConfig } from './types'
import * as types from './types'

export { types }

/** The Custom Vision API prediction handler. */
export class CustomVisionPredictor {
  /** The base URL for all prediction endpoints. */
  static baseURL = genBaseURL(region, service, version) + '/Prediction'

  /** The prediction key for the project */
  private predictionKey: string

  /** The project's ID */
  private projectID: string

  constructor({ predictionKey, projectID }: PredictorConfig) {
    this.predictionKey = predictionKey
    this.projectID = projectID
  }

  /**
   * Predict an image and optionally save the results.
   * 
   * @param image the image to be evaluated.
   * @param save whether or not to save the results.
   * @param iterationID the iteration to use for the prediction.
   * @returns the results of the prediction.
   */
  async predict(
    image: Binary | string,
    save = false,
    iterationID?: string
  ): Promise<ImagePredictionResult> {
    // determine if the image is a URL or raw data
    const binary = image.constructor !== String

    // create the correct endpoint
    let endpoint = binary ? 'image' : 'url'
    if (save) endpoint = 'inline/' + endpoint

    // build the request
    let req = post(this.genURL(endpoint)).set(
      'Prediction-Key',
      this.predictionKey
    )
    if (iterationID) req = req.query({ iterationId: iterationID })

    return (await req.send(binary ? image : { Url: image })).body
  }

  /** 
   * Generate an API URL given an endpoint and an optional iteration ID.
   *
   * @param endpoint the API endpoint to connect to. 
   * @returns the generated URL. 
   */
  private genURL(endpoint: string) {
    return `${CustomVisionPredictor.baseURL}/${this.projectID}/${endpoint}`
  }
}
