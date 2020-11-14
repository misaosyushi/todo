import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DB } from '../config';

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

    try {
      const response = await DB.query(params).promise();
      return {statusCode: 200, body: JSON.stringify(response.Items)};
    } catch (dbError) {
      return {statusCode: 500, body: JSON.stringify(dbError)};
    }
  }

  params = {
    TableName: process.env.TABLE_NAME,
  }

  try {
    const response = await DB.scan(params).promise();
    return {statusCode: 200, body: JSON.stringify(response.Items)};
  } catch (dbError) {
    return {statusCode: 500, body: JSON.stringify(dbError)};
  }
}
