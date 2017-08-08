export interface Config {
  APIKey: string
}

export type Attribution =
  | LicenseAttribution
  | LinkAttribution
  | MediaAttribution
  | TextAttribution

export interface Entity {
  bingId: string
  contractualRules: Attribution[]
  description: string
  entityPresentationInfo: EntityPresentationInfo
  image: Image
  name: string
  webSearchUrl: string
}

export interface EntityAnswer {
  queryScenario: 'DominantEntity' | 'DisambiguationItem'
  value: Entity[]
}

export type EntityEducationType =
  | 'CollegeOrUniversity'
  | 'School'
  | 'Speciality'

export type EntityEventType = 'Event'

export type EntityMediaType =
  | 'Book'
  | 'Movie'
  | 'TelevisionSeason'
  | 'TelevisionShow'
  | 'VideoGame'

export type EntityOtherType =
  | 'Animal'
  | 'Car'
  | 'Drug'
  | 'Food'
  | 'Product'
  | 'SportsTeam'

export type EntityPlaceType =
  | 'Attraction'
  | 'City'
  | 'Continent'
  | 'Country'
  | 'Hotel'
  | 'House'
  | 'LocalBusiness'
  | 'Locality'
  | 'MinorRegion'
  | 'Neighborhood'
  | 'Other'
  | 'PointOfInterest'
  | 'PostalCode'
  | 'RadioStation'
  | 'Region'
  | 'Restaurant'
  | 'State'
  | 'StreetAddress'
  | 'SubRegion'
  | 'TouristAttraction'
  | 'Travel'

export interface EntityPresentationInfo {
  entityScenario: string
  entityTypeDisplayHint: string
  entityTypeHint: EntityType | EntityType[]
}

export type EntityProfessionType = 'Actor' | 'Artist' | 'Attorney'

export type EntityType =
  | 'Generic'
  | 'Person'
  | 'Place'
  | 'Media'
  | 'Organization'

export interface Image {
  height: number
  hostPageUrl: string
  name: string
  provider: [Organization]
  thumbnailUrl: string
  width: number
}
  
export interface ImageResults {
  name: string
  webSearchUrl: string
  webSearchUrlPingSuffix: string
  thumbnailUrl: string
  datePublished: string
  contentUrl: string
  hostPageUrl: string
  hostPageUrlPingSuffix: string
  contentSize: string
  encodingFormat: string
  width: number
  height: number
  thumbnail: { width: number; height: number }
  imageInsightsToken: string
  insightsSourcesSummary: {
    shoppingSourcesCount: number
    recipeSourcesCount: number
  }
  imageId: string
  accentColor: string
}

export interface License {
  name: string
  url: string
}

export interface LicenseAttribution {
  _type: 'LicenseAttribution'
  license: License
  licenseNotice: string
  mustBeCloseToContent?: boolean
  targetPropertyName: string
}

export interface Link {
  _type: 'Link'
  text: string
  url: string
}

export interface LinkAttribution {
  _type: 'LinkAttribution'
  mustBeCloseToContent?: boolean
  targetPropertyName: string
  text: string
  url: string
}

export interface LocalEntityAnswer {
  _type: 'LocalEntityAnswer'
  value: Place[]
}

export type Market =
  | 'ar-SA'
  | 'da-DK'
  | 'de-AT'
  | 'de-CH'
  | 'de-DE'
  | 'en-AU'
  | 'en-CA'
  | 'en-GB'
  | 'en-ID'
  | 'en-IE'
  | 'en-IN'
  | 'en-MY'
  | 'en-NZ'
  | 'en-PH'
  | 'en-US'
  | 'en-ZA'
  | 'es-AR'
  | 'es-CL'
  | 'es-ES'
  | 'es-MX'
  | 'es-US'
  | 'fi-FI'
  | 'fr-BE'
  | 'fr-CA'
  | 'fr-CH'
  | 'fr-FR'
  | 'it-IT'
  | 'ja-JP'
  | 'ko-KR'
  | 'nl-BE'
  | 'nl-NL'
  | 'no-NO'
  | 'pl-PL'
  | 'pt-BR'
  | 'pt-PT'
  | 'ru-RU'
  | 'sv-SE'
  | 'tr-TR'
  | 'zh-CN'
  | 'zh-HK'
  | 'zh-TW'

export interface MediaAttribution {
  _type: 'MediaAttribution'
  mustBeCloseToContent?: boolean
  targetPropertyName: string
  url: string
}

export interface Organization {
  name: string
  url: string
}

export interface Place {
  _type: EntityPlaceType
  address: PostalAddress
  entityPresentationInfo: EntityPresentationInfo
  name: string
  telephone: string
  url: string
  webSearchUrl: string
}

export interface PostalAddress {
  addressCountry: string
  addressLocality: string
  addressRegion: string
  neighborhood: string
  postalCode: string
  text: string
}

export interface QueryContext {
  adultIntent: boolean
  alterationOverrideQuery: string
  alteredQuery: string
  askUserForLocation: boolean
  originalQuery: string
}

export type SafeSearch = 'Strict' | 'Moderate' | 'Off'

export interface SearchResponse {
  _type: 'SearchResponse'
  entities: EntityAnswer
  places: LocalEntityAnswer
  queryContext: QueryContext
}

export interface TextAttribution {
  _type: 'TextAttribution'
  text: string
}
