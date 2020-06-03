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

- Directly from API Gateway using DynamoDB API:
    - `GET /owner/all`: scans `Owner` table.
    - `GET /owner`: queries `Owner` table.
    - `POST /owner`: puts an item to `Owner` table.
    - `GET /owner/{ownerId}`: gets an owner item by its Id from `Owner` table.
    - `PUT /owner/{ownerId}`: updates an item by its Id to `Owner` table.
    - `DELETE /owner/{ownerId}`: deletes an item by its Id to `Owner` table.
- API Gateway AWS integration to Lambda Function, and using the `aws-sdk` to interact with DynamoDB
    - `GET /pet/all`: scans `Pet` table.
    - `GET /owner/{ownerId}/pet`: queries `Pet` table filtering by an owner.
    - `POST /owner/{ownerId}/pet`: puts an item to `Pet` table associated to a particular owner.
    - `GET /owner/{ownerId}/pet/{petId}`: gets an item by its Id from `Pet` table.
    - `PUT /owner/{ownerId}/pet/{petId}`: updates an item by its Id to `Pet` table.
    - `DELETE /owner/{ownerId}/pet/{petId}`: deletes an item by its Id to `Pet` table.
