export interface Config {
  APIKey: string
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

export type SafeSearch = 'Strict' | 'Moderate' | 'Off'
