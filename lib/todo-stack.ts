import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { ApiKeySourceType, LambdaIntegration, RestApi, Cors } from '@aws-cdk/aws-apigateway';

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
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS,
        statusCode: 200,
      }
    });

    const todos = api.root.addResource("todo");
    // list
    todos.addMethod("GET", new LambdaIntegration(listToDoFunction), {
      apiKeyRequired: true,
    });
    // post
    todos.addMethod("POST", new LambdaIntegration(postToDoFunction), {
      apiKeyRequired: true,
    });

    const todo = todos.addResource("{id}");
    // get
    todo.addMethod("GET", new LambdaIntegration(getToDoFunction), {
      apiKeyRequired: true,
    });
    // put
    todo.addMethod("PUT", new LambdaIntegration(putToDoFunction), {
      apiKeyRequired: true,
    });
    // delete
    todo.addMethod("DELETE", new LambdaIntegration(deleteToDoFunction), {
      apiKeyRequired: true,
    });

    const apiKey =  api.addApiKey('apiKey', {
      apiKeyName: 'ToDoAPIKey',
    })

    api.addUsagePlan('forAPIKey', {
      apiKey,
    }).addApiStage({
      stage: api.deploymentStage
    })
  }
}
