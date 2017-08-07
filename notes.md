# Notes

## Bing Entity Search API
- In the [LinkAttribution section of the 'Reference' page](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-entities-api-v7-reference#linkattribution), the description for `targetPropertyName` has an issue in the description field (\*cough\*`<provider />`\*cough\*).
- ['Reference' page](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-entities-api-v7-reference) includes critical information not present in the API reference (e.g. query parameter details).
- In the [Place section of the 'Reference page](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-entities-api-v7-reference#place), there is an unnecessary `<li>` tag in the `_type` field description, and an unnecessary `<br>` in the `LocalBusiness` list item.

## Bing Image Search API
- 'Reference' page includes critical information not present in the API reference (e.g. query parameter details).

## Custom Vision API
- In several locations, the API specifies `multipart/form-data` when it also accepts `octet-stream`, or occasionally other MIME-types; this could be better documented.
- Endpoint `/Training/projects` has a typo in the `description` field (of the of the).
- Endpoint `/Prediction/{projectId}/url` has an issue in the description field for the `imageUrl`; the reference to `{Iris.Web.Api.Models.ImageUrl}` doesn't show up correctly.
- Several tag-related endpoints reference `{take}` and `{skip}` which don't show up correctly.

### Nit-picking
- All properties in request & response bodies are upper-camel-case which differs from other cognitive service APIs.
- It would be helpful if errors were better documented.
- Missing from [the 'try' page](https://azure.microsoft.com/en-us/try/cognitive-services/).

## Face API
- Endpoint `/detect`: the provided example JSON has a typo (an extra closing brace in `faceAttributes.facialHair`), causing the entire object to be invalid.
- It would be helpful if the Swagger docs provided model definitions like other cognitive services do, rather than just examples.
