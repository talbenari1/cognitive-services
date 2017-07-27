import { Region, Service } from './types'

export const genBaseURL = (
  region: Region | null,
  service: Service,
  version: number
) =>
  `https://${region
    ? region + '.'
    : ''}api.cognitive.microsoft.com/${service}/v${version.toFixed(1)}`
