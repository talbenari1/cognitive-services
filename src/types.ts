import { types as bing } from './bing'
import { types as customVision } from './custom-vision'

export * from './custom-vision/types'
export * from './bing/types'

export type Region =
  // United States
  | 'eastus'
  | 'eastus2'
  | 'centralus'
  | 'northcentralus'
  | 'southcentralus'
  | 'westcentralus'
  | 'westus'
  | 'westus2'
  // Europe
  | 'northeurope'
  | 'westeurope'
  // Asia
  | 'southeastasia'
  | 'eastasia'
  

export type Service = 'customvision' | 'bing'

export interface Config {
  bing?: bing.Config
  customVision?: customVision.Config
}
