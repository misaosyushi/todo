import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DB } from '../config';
import { HEADER } from './todo';

export async function getHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.pathParameters) {
    return {
      statusCode: 400,
      body: 'Error: bad request',
    };
  }

  const primaryKey = process.env.PRIMARY_KEY || '';
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      [primaryKey]: event.pathParameters.id,
    },
  };

  try {
    const response = await DB.get(params).promise();
    return {
      statusCode: 200,
      headers: HEADER,
      body: JSON.stringify(response.Item)
    };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
}
