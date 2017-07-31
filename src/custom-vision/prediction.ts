import { genBaseURL } from 'src/utils'
import { post } from 'superagent'
import { region, service, version } from './constants'
import { Config, ImagePredictionResult } from './types'

const baseURL = genBaseURL(region, service, version) + '/Prediction'

export const prediction = ({ predictionKey, projectID }: Config) => {
  /**
   * Generate an API URL given an endpoint and an optional iteration ID.
   * @param endpoint the API endpoint to connect to.
   * @returns the generated URL.
   */
  const genURL = (endpoint: string) => `${baseURL}/${projectID}/${endpoint}`

  /**
   * Predict an image given its URL.
   * @param url the URL pointing to the image.
   * @param iterationID the iteration to use for predictions.
   * @returns the results of the prediction.
   */
  const predictURL = async (
    url: string,
    iterationID = ''
  ): Promise<ImagePredictionResult> =>
    (await post(genURL('url'))
      .set('Prediction-Key', predictionKey)
      .type('application/json')
      .query({ iterationId: iterationID })
      .send({ Url: url })).body

  /**
   * Predict an image given the image itself (file upload).
   * @param file the image file data. This function expects raw binary data, not a data URI.
   * @param iterationID the iteration to use for predictions.
   * @returns the results of the prediction.
   */
  const predictFile = async (
    file: Buffer,
    iterationID = ''
  ): Promise<ImagePredictionResult> =>
    (await post(genURL('image'))
      .set('Prediction-Key', predictionKey)
      .type('application/octet-stream')
      .query({ iterationId: iterationID })
      .send(file)).body

  return { predictFile, predictURL }
}
