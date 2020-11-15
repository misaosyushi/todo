import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DB } from '../config';
import { HEADER } from './todo';

export async function deleteHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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
  }

  // TODO: DBアクセス用のクラスに切り出したい
  try {
    await DB.delete(params).promise();
    return {
      statusCode: 200,
      headers: HEADER,
      body: 'Success',
    };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
}
