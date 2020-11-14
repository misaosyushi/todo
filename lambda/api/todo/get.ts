import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DB } from '../config';

const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

export async function getHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.pathParameters) {
    return {
      statusCode: 400,
      body: 'Error: bad request',
    };
  }

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: event.pathParameters.id,
    },
  };

  try {
    const response = await DB.get(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Item) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
}
