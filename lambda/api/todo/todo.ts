export interface ToDo {
  title: string
  detail: string
  deadlineDate: string
  status: string
}

export const HEADER = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-API-KEY,X-Amz-Security-Token',
  'Access-Control-Allow-Methods': 'OPTIONS,GET,PUT,POST,DELETE',
}

