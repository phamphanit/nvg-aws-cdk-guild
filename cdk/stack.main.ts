import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createApi } from './apigateway';
import { createSNSTopic, subscribeSQSToSNSTopic } from './events';
import { createContactRequestLambda } from './lambdas';
import { createContactRequestQueue } from './sqs';

export class MainStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const contactRequestTopic = createSNSTopic(this);

    const contactRequestLambda = createContactRequestLambda(this, {
      snsTopic: contactRequestTopic
    });

    const api = createApi(this, {
      contactRequestLambda
    });

    const contacQueue = createContactRequestQueue(this);
    subscribeSQSToSNSTopic(contactRequestTopic, contacQueue);
  }
}
