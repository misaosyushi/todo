import * as cdk from '@aws-cdk/core';
import {NodejsFunction} from '@aws-cdk/aws-lambda-nodejs';
import {AttributeType, Table} from '@aws-cdk/aws-dynamodb';
import {ApiKeySourceType, LambdaIntegration, RestApi} from '@aws-cdk/aws-apigateway';

export class TodoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const tableName = 'ToDoTable';
    const primaKey = 'id';

    const getToDoFunction = new NodejsFunction(this, 'todoGetFunction', {
      entry: 'lambda/api/todo/get.ts',
      handler: 'handler',
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

    const api = new RestApi(this, "todoApi", {
      restApiName: "ToDoAPI",
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    const todoRoot = api.root.addResource("todo");
    const todo = todoRoot.addResource("{id}");
    // @ts-ignore
    const getToDoIntegration = new LambdaIntegration(getToDoFunction);
    todo.addMethod("GET", getToDoIntegration);
  }
}
