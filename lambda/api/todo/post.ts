import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuid } from 'uuid';
import { DB } from '../config';
import { ToDo, HEADER } from './todo';

export async function postHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Error: bad request',
    };
  }

  const toDo: ToDo = JSON.parse(event.body)
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      'id': uuid(),
      'title': toDo.title,
      'detail': toDo.detail,
      'deadlineDate': toDo.deadlineDate,
      'status': toDo.status,
    }
  }

  // TODO: DBアクセス用のクラスに切り出したい
  try {
    await DB.put(params).promise();
    return {
      statusCode: 200,
      headers: HEADER,
      body: 'Success',
    };
  } catch (dbError) {
    return {statusCode: 500, body: JSON.stringify(dbError)};
  }
}
