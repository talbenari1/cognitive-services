# Notes

## Custom Vision API
- In several locations, the API specifies `multipart/form-data` when it also accepts `octet-stream`, or occasionally other MIME-types; this could be better documented.
- Endpoint `/Training/projects` has a typo in the `description` field (of the of the).
- Endpoint `/Prediction/{projectId}/url` has an issue in the description field for the `imageUrl`; the reference to `Iris.Web.Api.Models.ImageUrl` doesn't show up correctly.
- All properties are upper-camel-case which differs from other cognitive service APIs.
- It would be helpful if errors were better documented.

## Face API
- Endpoint `/detect`: the provided example JSON has a typo (an extra closing brace in `faceAttributes.facialHair`), causing the entire object to be invalid.
- It would be helpful if the Swagger docs provided model definitions like other cognitive services do, rather than just examples.