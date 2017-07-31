import { genBaseURL } from 'src/utils'
import { get, post } from 'superagent'
import { region, service, version } from './constants'
import {
  Config,
  CreateImageSummary,
  Domain,
  ImageIdCreateBatch,
  ImageTag,
  Project
} from './types'

const baseURL = genBaseURL(region, service, version) + '/Training'

export const training = ({ projectID, trainingKey }: Config) => {
  /**
   * Generate a URL with the project ID and a given endpoint.
   * @param endpoint the endpoint to use in the URL.
   * @returns the generated URL.
   */
  const genURL = (endpoint: string) =>
    `${baseURL}/projects/${projectID}/${endpoint}`

  /**
   * Add an image to the current project iteration.
   * @param file binary data for the image to be sent.
   * @param tags the tag names to associate with the provided image.
   * @returns a summary of the action.
   */
  const addImage = async (
    file: Buffer,
    tags: string[]
  ): Promise<CreateImageSummary> =>
    (await post(genURL(`images/image`))
      .set('Training-Key', trainingKey)
      .type('application/octet-stream')
      .query({ tagIds: tags.join() })
      .send(file)).body

  /**
   * Add images to the current project iteration given their URLs.
   * @param urls the urls that point to the images.
   * @param tags the tag names to associate with all provided images.
   * @returns a summary of the action.
   */
  const addImageURLs = async (
    urls: string[],
    tags: string[]
  ): Promise<CreateImageSummary> =>
    (await post(genURL('images/url'))
      .set('Training-Key', trainingKey)
      .send({ Urls: urls, TagIds: tags })).body

  /**
   * Add images to the current project iteration from past predictions.
   * @param images the prediction image IDs to add.
   * @param tags the tag IDs to add.
   */
  const addImagePredictions = async (
    images: string[],
    tags: string[]
  ): Promise<CreateImageSummary> =>
    (await post(genURL('images/predictions'))
      .set('Training-Key', trainingKey)
      .send({ Ids: images, TagIds: tags } as ImageIdCreateBatch)).body

  /**
   * Get a list of the available domains and their IDs.
   * @param force whether or not to force the function to re-fetch the info, disabling memoization.
   * @returns a list of available domains.
   */
  const getDomains = (() => {
    let domains: Promise<Domain[]>
    return async (force = false) => {
      if (!domains || force) {
        domains = (await get(baseURL + '/domains').set(
          'Training-Key',
          trainingKey
        )).body
      }

      return domains
    }
  })()

  /**
   * Get a domain object given its name.
   * @param name the domain name.
   * @returns the domain's details.
   */
  const findDomain = async (name: string): Promise<Domain> => {
    const domain = (await getDomains()).find((el: Domain) => el.Name === name)
    if (!domain) throw new Error(`Domain not found: ${name}`)
    return domain
  }

  /**
   * Create a new project.
   * @param name the name of the project to create.
   * @param description the description of the project.
   * @param domain the name of the domain to use.
   * @returns the created project's details.
   */
  const createProject = async (
    name: string,
    description: string,
    domain = 'General'
  ): Promise<Project> =>
    (await post(baseURL + '/projects').set('Training-Key', trainingKey).query({
      description,
      domainId: (await findDomain(domain)).Id || '',
      name
    })).body

  /**
   * Get all projects associated with an account.
   * @returns the projects' details.
   */
  const getProjects = async (): Promise<Project[]> =>
    (await get(baseURL + '/projects').set('Training-Key', trainingKey).send())
      .body

  /**
   * Create a new tag.
   * @param name the name of the tag to create.
   * @param description the description of the tag.
   * @returns the created tag's details.
   */
  const createTag = async (name: string, description = ''): Promise<ImageTag> =>
    (await post(genURL('tags'))
      .set('Training-Key', trainingKey)
      .query({ name, description })).body

  /**
   * Get all tags associated with a project iteration.
   * @returns the tags' details.
   */
  const getTags = async (iterationId?: string) =>
    (await get(genURL('tags')).set('Training-Key', trainingKey)).body

  return {
    createProject,

    findDomain,

    addImage,
    addImageURLs,
    addImagePredictions,

    createTag,
    getTags
  }
}
