export interface PredictorConfig {
  predictionKey: string
  projectID: string
}

export interface TrainerConfig {
  trainingKey: string
  projectID: string
}

export interface Config {
  predictionKey?: string
  trainingKey: string
  projectID?: string
}

export interface Account {
  UserName: string
  Email: string
  Keys: ApiKeys
  Quotas: AccountQuota
}

export interface AccountQuota {
  Tier: string
  Projects: Quota
  Predictions: Quota
  PerProject: PerProjectQuota[]
}

export interface ApiKeys {
  TrainingKeys: KeyPair
  PredictionKeys: KeyPair
}

export interface CreateImageResult {
  SourceUrl: string
  Image: Image
  Status:
    | 'OK'
    | 'OKDuplicate'
    | 'ErrorSource'
    | 'ErrorImageFormat'
    | 'ErrorImageSize'
    | 'ErrorStorage'
    | 'ErrorLimitExceed'
    | 'ErrorUnknown'
}

export interface CreateImageSummary {
  IsBatchSuccessful: boolean
  Images: CreateImageResult[]
}

export interface Domain {
  Id: string
  Name: string
}

export interface Image {
  Id: string
  Created: string
  Width: number
  Height: number
  ImageUri: string
  ThumbnailUri: string
  Labels: ImageLabel[]
  Predictions: PredictionTag[]
}

export interface ImageIdCreateBatch {
  TagIds: string[]
  Ids: string[]
}

export interface ImageLabel {
  LabelId: string
  Created: string
  TagId: string
}

export interface ImagePredictionResult {
  Id: string
  Project: string
  Iteration: string
  Created: string
  Predictions: ImageTagPrediction[]
}

export interface ImageTag {
  Id: string
  Name: string
  Description: string
  ImageCount: number
}

export interface ImageTagList {
  Tags: ImageTag[]
  TotalTaggedImages: number
  TotalUntaggedImages: number
}

export interface ImageTagPerformance {
  TagId: string
  TagName: string
  Precision: number
  PrecisionStdDeviation: number
  Recall: number
  RecallStdDeviation: number
}

export interface ImageTagPrediction {
  TagId: string
  Tag: string
  Probability: number
}

export interface ImageUrlCreateBatch {
  TagIds: string[]
  Urls: string[]
}

export interface Iteration {
  Id: string
  Name: string
  Status: string
  Created: string
  LastModified: string
  TrainedAt: string
  IsDefault: boolean
}

export interface IterationPerformance {
  PerTagPerformance: ImageTagPerformance[]
  Precision: number
  PrecisionStdDeviation: number
  Recall: number
  RecallStdDeviation: number
}

export interface KeyPair {
  PrimaryKey: string
  SecondaryKey: string
}

export interface PerProjectQuota {
  ProjectId: string
  Iterations: Quota[]
  Images: Quota[]
  Tags: Quota[]
}

export interface Prediction {
  Id: string
  Project: string
  Iteration: string
  Created: string
  Predictions: PredictionTag[]
  ImageUri: string
  ThumbnailUri: string
}

export interface PredictionQuery {
  Results: Prediction[]
  Token: PredictionQueryToken
}

export interface PredictionQueryToken {
  Session: string
  Continuation: string
  MaxCount: number
  OrderBy: 'Newest' | 'Oldest' | 'Suggested'
  IterationId: string
  TagIds: string[]
  Threshold: number
  StartTime: string
  EndTime: string
  Source: string
}

export interface PredictionTag {
  TagId: string
  Tag: string
  Probability: number
}

export interface Project {
  Id: string
  Name: string
  Description: string
  CurrentIterationId: string
  Created: string
  LastModified: string
  Settings: ProjectSettings
  ThumbnailUri: string
}

export interface ProjectSettings {
  DomainId: string
}

export interface Quota {
  Total: number
  Used: number
  TimeUntilReset: number
}
