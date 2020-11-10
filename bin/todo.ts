#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TodoStack } from '../lib/todo-stack';

const app = new cdk.App();
new TodoStack(app, 'TodoStack');
