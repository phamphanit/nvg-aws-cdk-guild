import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createApi } from './apigateway';
import { createSNSTopic, subscribeSQSToSNSTopic } from './events';
import { createContactRequestLambda, createSendEmailLambda, subscribeLambdaToSQS } from './lambdas';
import { createContactBucket } from './s3';
import { createContactRequestQueue, createMaintenanceQueue } from './sqs';

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

    const contactQueue = createContactRequestQueue(this);
    subscribeSQSToSNSTopic(contactRequestTopic, contactQueue);

    const contactBucket = createContactBucket(this);

    const maintenanceQueue = createMaintenanceQueue(this);
    const contactLambda = createSendEmailLambda(this, contactBucket, maintenanceQueue);
    subscribeLambdaToSQS(contactQueue, contactLambda);
  }
}
