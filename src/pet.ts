import {DynamoDB} from "aws-sdk";
import {CustomHandler, Pet, QueryResult} from "./model";

interface FromOwner {
  OwnerId: number
  ExclusiveStartKey: DynamoDB.DocumentClient.Key
}

const PET_TABLE_NAME = process.env.PET_TABLE_NAME as string;
const ddbClient = new DynamoDB.DocumentClient({region: process.env.AWS_REGION});

export const all: CustomHandler<FromOwner, Pet[]> = (event, context, callback) => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: PET_TABLE_NAME
  };
  ddbClient.scan(params, (err, data) => {
    if(err) {
      callback({name: err.code, message: err.message});
    } else {
      callback(null, data.Items ? data.Items as Pet[] : []);
    }
  });
}

export const paginate: CustomHandler<FromOwner, QueryResult<Pet>> = ({OwnerId, ExclusiveStartKey}, context, callback) => {

  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: PET_TABLE_NAME,
    KeyConditionExpression: "OwnerId = :cId",
    IndexName: "OwnerIdIndex",
    ExpressionAttributeValues: {
      ":cId": OwnerId
    },
    Limit: 2,
    ExclusiveStartKey
  };
  ddbClient.query(params, (err, data) => {
    if(err) {
      callback({name: err.code, message: err.message});
    } else {
      callback(null, {
        Items: data.Items ? data.Items as Pet[] : [],
        LastEvaluatedKey: data.LastEvaluatedKey
      });
    }
  });
}
