import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DB } from '../config';
import { ToDo } from './todo';

const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

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

  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: event.pathParameters.id,
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

  try {
    const response = await DB.update(params).promise();
    return { statusCode: 200, body: JSON.stringify(response.Item) };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
}
