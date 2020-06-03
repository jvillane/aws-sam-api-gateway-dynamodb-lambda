import {DynamoDB} from "aws-sdk";
import {CustomHandler, Pet, QueryResult} from "./model";

interface FromOwner {
  ownerId: number
  exclusiveStartKey: DynamoDB.DocumentClient.Key
}

interface IdsRequest {
  ownerId: number
  petId: number
}

interface PutRequest {
  ownerId: number
  petId: number
  pet: Pet
}

interface PostRequest {
  ownerId: number
  pet: Pet
}

const PET_TABLE_NAME = process.env.PET_TABLE_NAME as string;
const ddbClient = new DynamoDB.DocumentClient({region: process.env.AWS_REGION});

export const scan: CustomHandler<FromOwner, Pet[]> = (event, context, callback) => {
  const params: DynamoDB.DocumentClient.ScanInput = {
    TableName: PET_TABLE_NAME
  };
  ddbClient.scan(params, (err, data) => {
    if (err) {
      callback({name: err.code, message: err.message});
    } else {
      callback(null, data.Items ? data.Items as Pet[] : []);
    }
  });
}

export const query: CustomHandler<FromOwner, QueryResult<Pet>> = ({ownerId, exclusiveStartKey}, context, callback) => {
  const params: DynamoDB.DocumentClient.QueryInput = {
    TableName: PET_TABLE_NAME,
    KeyConditionExpression: "OwnerId = :ownerId",
    IndexName: "OwnerIdIndex",
    ExpressionAttributeValues: {
      ":ownerId": ownerId
    },
    Limit: 2,
    ExclusiveStartKey: exclusiveStartKey
  };
  ddbClient.query(params, (err, data) => {
    if (err) {
      callback({name: err.code, message: err.message});
    } else {
      callback(null, {
        Items: data.Items ? data.Items as Pet[] : [],
        LastEvaluatedKey: data.LastEvaluatedKey
      });
    }
  });
}

export const get: CustomHandler<IdsRequest, Pet | {}> = ({ownerId, petId}, context, callback) => {
  const params: DynamoDB.DocumentClient.GetItemInput = {
    TableName: PET_TABLE_NAME,
    Key: {
      "Id": petId
    }
  };
  ddbClient.get(params, (err, data) => {
    if (err) {
      callback({name: err.code, message: err.message});
    } else {
      let item = {};
      if (data.Item) {
        item = data.Item;
      }
      callback(null, item);
    }
  });
}

export const put: CustomHandler<PutRequest, any> = ({ownerId, pet}, context, callback) => {
  const now = new Date();
  const item: Pet = {
    Id: now.getTime(),
    Name: pet.Name,
    CreatedAt: now.toISOString(),
    Tags: [],
    Active: 1
  };
  const params: DynamoDB.DocumentClient.PutItemInput = {
    TableName: PET_TABLE_NAME,
    Item: item
  };

  ddbClient.put(params, (err, data) => {
    if (err) {
      callback({name: err.code, message: err.message});
    } else {
      callback(null, data);
    }
  });
}

export const update: CustomHandler<PutRequest, any> = ({ownerId, petId, pet}, context, callback) => {
  const params: DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: PET_TABLE_NAME,
    Key: {
      Id: petId
    },
    UpdateExpression: "SET #Name = :name, Tags = :tags, Active = :active",
    ExpressionAttributeValues: {
      ":name": pet.Name,
      ":tags": pet.Tags,
      ":active": pet.Active
    },
    ExpressionAttributeNames: {
      "#Name": "Name"
    }
  };

  ddbClient.update(params, (err, data) => {
    if (err) {
      callback({name: err.code, message: err.message});
    } else {
      callback(null, data);
    }
  });
}

export const remove: CustomHandler<IdsRequest, any> = ({ownerId, petId}, context, callback) => {
  const params: DynamoDB.DocumentClient.DeleteItemInput = {
    TableName: PET_TABLE_NAME,
    Key: {
      "Id": petId
    }
  };
  ddbClient.delete(params, (err, data) => {
    if (err) {
      callback({name: err.code, message: err.message});
    } else {
      callback(null, {});
    }
  });
}
