import {APIGatewayEventRequestContext, Callback} from "aws-lambda";

export type CustomHandler<E,R> = (event: E, context: APIGatewayEventRequestContext, callback: Callback<R>) => void;

export interface Owner {
  Id: number
  Name: string
  CreatedAt: string
}

export interface Pet {
  Id: number
  Name: string
  CreatedAt: string
  Tags: string[]
}

export interface QueryResult<E> {
  Items: E[]
  LastEvaluatedKey?: object
}
