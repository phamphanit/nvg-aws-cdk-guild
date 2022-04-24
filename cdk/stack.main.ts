import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createApi } from './apigateway';
import { createContactRequestLambda } from './lambdas';
import { APIGatewayEvent, Context } from 'aws-lambda';

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const contactRequestLambda = createContactRequestLambda(this);
    const api = createApi(this, {
      contactRequestLambda
    });
  }
}
