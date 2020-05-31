# Veterinary API (aka aws-sam-api-gateway-dynamodb-lambda)
A simple example using ApiGateway or ApiGateway + Lambda to interact with Dynamo DB, using:

- TypeScript + Node for lambda implementation
- API Gateway + OpenAPI/Swagger integration for API validation
- AWS SAM for infrastructure templating

## Requirements

- Node + NPM
- aws-cli (installed and configured)
- aws-sam-cli

## Deployment

There's a sh file called `deploy.sh` meant to be used for infrastructure creating/updating:

`sh deploy.sh <STACK_NAME> <S3_BUCKET>`

Where:

- `STACK_NAME` is the name of the stack
- `S3_BUCKET` refers to an existing S3 bucket where the OpenAPI definition is going to be upload

## The Result

An API whose Url can be obtained on the CloudFormation stack outputs (`ApiUrl`) with the endpoints:

- `GET /owner/all`: Dynamo Table `Owner` scan directly from Dynamo.
- `GET /owner`: Dynamo Table `Owner` query directly from Dynamo.
- `GET /pet/all`: Dynamo Table `Pet` scan trough a Lambda from Dynamo.
- `GET /owner/{ownerId}/pet`: Dynamo Table `Pet` query trough a Lambda from Dynamo.
