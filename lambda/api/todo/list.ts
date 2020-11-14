import { APIGatewayProxyResult } from 'aws-lambda';
import { DB } from '../config';

export async function listHandler(): Promise<APIGatewayProxyResult> {
  const params = {
    TableName: process.env.TABLE_NAME,
  }

  try {
    const response = await DB.scan(params).promise();
    return {statusCode: 200, body: JSON.stringify(response.Items)};
  } catch (dbError) {
    return {statusCode: 500, body: JSON.stringify(dbError)};
  }
}
