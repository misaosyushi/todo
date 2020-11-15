import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DB } from '../config';
import { HEADER } from './todo';

export async function listHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  let params
  if (event.queryStringParameters != null) {
    params = {
      TableName: process.env.TABLE_NAME,
      IndexName: process.env.INDEX_NAME,
      ExpressionAttributeNames:{'#t': 'title'},
      ExpressionAttributeValues:{':title': event.queryStringParameters.title},
      KeyConditionExpression: '#t = :title'
    }

    // TODO: DBアクセス用のクラスに切り出したい
    try {
      const response = await DB.query(params).promise();
      return {
        statusCode: 200,
        headers: HEADER,
        body: JSON.stringify(response.Items),
      };
    } catch (dbError) {
      return { statusCode: 500, body: JSON.stringify(dbError) };
    }
  }

  params = {
    TableName: process.env.TABLE_NAME,
  }

  try {
    const response = await DB.scan(params).promise();
    return {
      statusCode: 200,
      headers: HEADER,
      body: JSON.stringify(response.Items),
    };
  } catch (dbError) {
    return {statusCode: 500, body: JSON.stringify(dbError)};
  }
}
