import * as cdk from '@aws-cdk/core';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { ApiKeySourceType, LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';

export class TodoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableName = 'ToDoTable';
    const primaKey = 'id';

    const getToDoFunction = new NodejsFunction(this, 'todoGetFunction', {
      entry: 'lambda/api/todo/get.ts',
      handler: 'getHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
        'PRIMARY_KEY': primaKey,
      },
    });

    const listToDoFunction = new NodejsFunction(this, 'todoListFunction', {
      entry: 'lambda/api/todo/list.ts',
      handler: 'listHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
      },
    });

    const postToDoFunction = new NodejsFunction(this, 'todoPostFunction', {
      entry: 'lambda/api/todo/post.ts',
      handler: 'postHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
      },
    });

    const putToDoFunction = new NodejsFunction(this, 'todoPutFunction', {
      entry: 'lambda/api/todo/put.ts',
      handler: 'putHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
        'PRIMARY_KEY': primaKey,
      },
    });

    const deleteToDoFunction = new NodejsFunction(this, 'todoDeleteFunction', {
      entry: 'lambda/api/todo/delete.ts',
      handler: 'deleteHandler',
      timeout: cdk.Duration.seconds(30),
      environment: {
        'TABLE_NAME': tableName,
        'PRIMARY_KEY': primaKey,
      },
    });

    const todoTable = new Table(this, 'todo', {
      tableName: tableName,
      partitionKey: {
        name: primaKey,
        type: AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    // FIXME: コンパイルエラーになってるけどcdkコマンドは通る。typesが足りないとか？
    // @ts-ignore
    todoTable.grantReadData(getToDoFunction)
    // @ts-ignore
    todoTable.grantReadData(listToDoFunction)
    // @ts-ignore
    todoTable.grantWriteData(postToDoFunction)
    // @ts-ignore
    todoTable.grantWriteData(putToDoFunction)
    // @ts-ignore
    todoTable.grantWriteData(deleteToDoFunction)

    const api = new RestApi(this, "todoApi", {
      restApiName: "ToDoAPI",
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    const todos = api.root.addResource("todo");
    // @ts-ignore
    const listToDoIntegration = new LambdaIntegration(listToDoFunction);
    todos.addMethod("GET", listToDoIntegration);
    // @ts-ignore
    const postToDoIntegration = new LambdaIntegration(postToDoFunction);
    todos.addMethod("POST", postToDoIntegration);

    const todo = todos.addResource("{id}");
    // @ts-ignore
    const getToDoIntegration = new LambdaIntegration(getToDoFunction);
    todo.addMethod("GET", getToDoIntegration);
    // @ts-ignore
    const putToDoIntegration = new LambdaIntegration(putToDoFunction);
    todo.addMethod("PUT", putToDoIntegration);
    // @ts-ignore
    const deleteToDoIntegration = new LambdaIntegration(deleteToDoFunction);
    todo.addMethod("DELETE", deleteToDoIntegration);
  }
}
