import { types as bing } from './bing'
import { types as customVision } from './custom-vision'

export type Region = 'southcentralus'
export type Service = 'customvision' | 'bing'

export interface Config {
  bing?: bing.Config
  customVision?: customVision.Config
}

export { bing, customVision }
