import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DB } from '../config';
import { HEADER, ToDo } from './todo';

export async function putHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event.pathParameters) {
    return {
      statusCode: 400,
      body: 'Error: bad request',
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Error: bad request',
    };
  }

  const toDo: ToDo = JSON.parse(event.body)
  const primaryKey = process.env.PRIMARY_KEY || '';

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      [primaryKey]: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#t': 'title',
      '#d': 'detail',
      '#dd': 'deadlineDate',
      '#s': 'status',
    },
    ExpressionAttributeValues: {
      ':newTitle' : toDo.title,
      ':newDetail' : toDo.detail,
      ':newDeadlineDate' : toDo.deadlineDate,
      ':newStatus' : toDo.status,
    },
    UpdateExpression: 'set #t = :newTitle, #d = :newDetail, #dd = :newDeadlineDate, #s = :newStatus',
  };

  // TODO: DBアクセス用のクラスに切り出したい
  try {
    await DB.update(params).promise();
    return {
      statusCode: 200,
      headers: HEADER,
      body: 'Success',
    };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
}
