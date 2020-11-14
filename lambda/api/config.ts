import aws from 'aws-sdk';
export const DB = new aws.DynamoDB.DocumentClient();
