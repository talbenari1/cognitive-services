import { genBaseURL } from 'src/utils'
import { post } from 'superagent'
import { region, service, version } from './constants'
import { Config, ImageTagPrediction } from './types'

const baseURL = genBaseURL(region, service, version)

export const prediction = ({ predictionKey, projectID }: Config) => {
  /**
   * Generate an API URL given an endpoint and an optional iteration ID.
   * @param endpoint - the API endpoint to connect to.
   * @param iterationId - the training iteration to use for predictions.
   * @returns the generated URL.
   */
  const genURL = (endpoint: string, iterationId = '') =>
    `${baseURL}/${projectID}/${endpoint}?iterationId=${iterationId}`

  /**
   * Predict an image given its URL.
   * @param url the URL pointing to the image
   * @returns the results of the prediction.
   */
  const predictURL = async (url: string): Promise<ImageTagPrediction[]> =>
    (await post(genURL('url'))
      .set('Prediction-Key', predictionKey)
      .set('Content-Type', 'application/json')
      .send({ Url: url })).body.Predictions

  /**
   * Predict an image given the image itself (file upload).
   * @param {Blob} file the image file data. This function expects raw binary data,
   * not a data URI.
   * @returns the results of the prediction.
   */
  const predictFile = async (file: Buffer): Promise<ImageTagPrediction[]> =>
    (await post(genURL('image'))
      .set('Prediction-Key', predictionKey)
      .set('Content-Type', 'application/octet-stream')
      .send(file)).body.Predictions

  return { predictFile, predictURL }
}
