export interface Config {
  predictionKey: string
  trainingKey: string
  projectID?: string
}

export interface Domain {
  Id: string
  Name: string
}

export interface ImageTagPrediction {
  TagId: string
  Tag: string
  Probability: number
}

export interface Project {
  Id: string
  Name: string
  Description: string
  CurrentIterationId: string
}

export interface Tag {
  Id: string
  Name: string
  Description: string
  ImageCount: number
}
