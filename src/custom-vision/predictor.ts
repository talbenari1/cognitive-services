import { post } from 'superagent'
import { genBaseURL } from '../utils'
import { region, service, version } from './constants'
import { ImagePredictionResult, PredictorConfig } from './types'
import * as types from './types'

export { types }

type Binary = Blob | Buffer | ArrayBuffer

/** The Custom Vision API prediction handler. */
export class CustomVisionPredictor {
  /** The base URL for all prediction endpoints. */
  static baseURL = genBaseURL(region, service, version) + '/Prediction'

  /** The prediction key for the project */
  private predictionKey: string

  /** The project's ID */
  private projectID: string

  constructor({ predictionKey, projectID }: types.PredictorConfig) {
    this.predictionKey = predictionKey
    this.projectID = projectID
  }

  /**
   * Predict an image and optionally save the results.
   * 
   * @param image the image to be evaluated.
   * @param save whether or not to save the results.
   * @param iterationID the iteration to use for the prediction.
   * @returns 
   */
  async predict(
    image: Binary | string,
    save = false,
    iterationID?: string
  ): Promise<ImagePredictionResult> {
    // determine if the images are URLs or raw data
    const binary = image.constructor === String

    // create the correct endpoint
    let endpoint = binary ? 'url' : 'image'
    if (save) endpoint = 'inline/' + endpoint

    // build the request
    let req = post(CustomVisionPredictor.baseURL + endpoint)
    if (iterationID) req = req.query({ iterationId: iterationID })

    return (await req.send(binary ? image : { Url: image })).body
  }
}
