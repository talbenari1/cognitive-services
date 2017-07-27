import { genBaseURL } from 'src/utils'
import { get, post } from 'superagent'
import { region, service, version } from './constants'
import { Config, Domain, Project, Tag } from './types'

const baseURL = genBaseURL(region, service, version)

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
   * @param file - binary data for the image to be sent.
   * @returns whether or not the operation was successful.
   */
  const addImage = async (file: Buffer): Promise<boolean> =>
    (await post(genURL(`images/image`))
      .set('Training-Key', trainingKey)
      .set('Content-Type', 'application/octet-stream')
      .send(file)).body

  const addImageURLs = async (urls: string[], tags: string[]) =>
    (await post(genURL('images/url'))
      .set('Training-Key', trainingKey)
      .send({ Urls: urls, TagIds: tags })).body

  /**
   * Get a list of the available domains and their IDs.
   * @param force - whether or not to force the function to re-fetch the info, disabling memoization.
   * @returns a list of objects containing the Name and Id of each domain.
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
   * @param name - the domain name.
   */
  const findDomain = async (name: string): Promise<Domain> => {
    const domain = (await getDomains()).find((el: Domain) => el.Name === name)
    if (!domain) throw new Error(`Domain not found: ${name}`)
    return domain
  }

  /**
   * Create a new project.
   * @param name - the name of the project to create.
   * @param description - the description of the project.
   * @param domain - the name of the domain to use; defaults to 'General'.
   * @returns an object containing all of the project's details.
   */
  const createProject = async (
    name: string,
    description: string,
    domain = 'General'
  ): Promise<Project> =>
    (await post(baseURL + '/projects').set('Training-Key', trainingKey).query({
      description,
      domainId: (await findDomain(domain)).Id || null,
      name
    })).body

  const createTag = async (name: string, description = ''): Promise<Tag> =>
    (await post(genURL('tags'))
      .set('Training-Key', trainingKey)
      .query({ name, description })).body

  const getTags = async () =>
    (await get(genURL('tags')).set('Training-Key', trainingKey)).body.Tags

  return {
    createProject,

    addImage,
    addImageURLs,

    createTag,
    getTags
  }
}
