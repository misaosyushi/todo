import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { ApiKeySourceType, LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';

export class TodoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableName = 'ToDoTable';
    const primaryKey = 'id';
    const indexName = 'title-index';

    const todoTable = new Table(this, 'toDoTable', {
      tableName: tableName,
      partitionKey: {
        name: primaryKey,
        type: AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    todoTable.addGlobalSecondaryIndex({
      indexName: indexName,
      partitionKey: {
        name: 'title',
        type: AttributeType.STRING
      },
    });

    const getToDoFunction = new NodejsFunction(this, 'getToDoFunction', {
      entry: 'lambda/api/todo/get.ts',
      handler: 'getHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
        'PRIMARY_KEY': primaryKey,
      },
    });

    const listToDoFunction = new NodejsFunction(this, 'listToDoFunction', {
      entry: 'lambda/api/todo/list.ts',
      handler: 'listHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
        'INDEX_NAME': indexName,
      },
    });

    const postToDoFunction = new NodejsFunction(this, 'postToDoFunction', {
      entry: 'lambda/api/todo/post.ts',
      handler: 'postHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
      },
    });

    const putToDoFunction = new NodejsFunction(this, 'putToDoFunction', {
      entry: 'lambda/api/todo/put.ts',
      handler: 'putHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
        'PRIMARY_KEY': primaryKey,
      },
    });

    const deleteToDoFunction = new NodejsFunction(this, 'deleteToDoFunction', {
      entry: 'lambda/api/todo/delete.ts',
      handler: 'deleteHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
        'PRIMARY_KEY': primaryKey,
      },
    });

    todoTable.grantReadData(getToDoFunction)
    todoTable.grantReadData(listToDoFunction)
    todoTable.grantWriteData(postToDoFunction)
    todoTable.grantWriteData(putToDoFunction)
    todoTable.grantWriteData(deleteToDoFunction)

    const api = new RestApi(this, "todoApi", {
      restApiName: "ToDoAPI",
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    const todos = api.root.addResource("todo");
    // list
    const listToDoIntegration = new LambdaIntegration(listToDoFunction);
    todos.addMethod("GET", listToDoIntegration);
    // post
    const postToDoIntegration = new LambdaIntegration(postToDoFunction);
    todos.addMethod("POST", postToDoIntegration);

    const todo = todos.addResource("{id}");
    // get
    const getToDoIntegration = new LambdaIntegration(getToDoFunction);
    todo.addMethod("GET", getToDoIntegration);
    // put
    const putToDoIntegration = new LambdaIntegration(putToDoFunction);
    todo.addMethod("PUT", putToDoIntegration);
    // delete
    const deleteToDoIntegration = new LambdaIntegration(deleteToDoFunction);
    todo.addMethod("DELETE", deleteToDoIntegration);
  }
}
