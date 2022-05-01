import { CfnOutput, Duration } from "aws-cdk-lib";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SQS } from "aws-sdk";
import { QueueAttributeName } from "aws-sdk/clients/sqs";
import { Construct } from "constructs/lib/construct";
import { BaseEventPayload, ContactRequest } from "../app/src/types";
import * as retry from 'async-retry'

const sqs = new SQS({ apiVersion: '2012-11-05', region: 'us-east-1' });

export const createContactRequestQueue = (scope: Construct) => {
  const queue = new Queue(scope, `ContactRequestQueue`, {
    retentionPeriod: Duration.days(14),
    queueName: `${process.env.UNIQUE_SUFFIX}-contact-request-queue`,
    deliveryDelay: Duration.minutes(0),

  });

  new CfnOutput(scope, 'ContactRequestQueueUrl', {
    value: queue.queueUrl,
  });

  return queue;
};
export const createMaintenanceQueue = (scope: Construct) => {
  const queue = new Queue(scope, `MaintenanceQueue`, {
    retentionPeriod: Duration.days(14),
    queueName: `${process.env.UNIQUE_SUFFIX}-maintenance-queue`,
    deliveryDelay: Duration.minutes(0),
  });

  new CfnOutput(scope, 'MaintenanceQueueUrl', {
    value: queue.queueUrl,
  });

  return queue;
};
export async function pushContactRequestToSQS(
  contactRequest: BaseEventPayload<ContactRequest>
): Promise<void> {
  const sqs = new SQS({
    region: process.env.AWS_REGION,
  });

  await sqs
    .sendMessage({
      MessageBody: JSON.stringify({
        Message: JSON.stringify({ contactRequest }),
      }),
      QueueUrl: process.env.SQS_MAINTENANCE_URL!,
    })
    .promise();
}

const APPROXIMATE_NUMBER_OF_MESSAGES_ATTRIBUTES: QueueAttributeName[] = [
  'ApproximateNumberOfMessages',
  'ApproximateNumberOfMessagesDelayed',
  'ApproximateNumberOfMessagesNotVisible',
];

export async function clearSQSMessages(queueUrl: string): Promise<void> {
  await retry(
    async (bail) => {
      try {
        await purgeQueueMessages(queueUrl);
      } catch (error) {
        const isMoreThanOnePurgeWithin60SecondsError = (
          error as Error
        ).message.startsWith('Only one PurgeQueue operation on');
        if (isMoreThanOnePurgeWithin60SecondsError) {
          // suppress and retry
          throw error;
        } else {
          bail(error as Error);
        }
      }
    },
    { retries: 30, minTimeout: 2000, maxTimeout: 2000 }
  );

  await retry(
    async () => {
      const numberOfMessagesLeft = await getApproximateNumberOfMessages(
        queueUrl
      );
      if (numberOfMessagesLeft > 0) {
        throw new Error('queue not empty yet');
      }
    },
    { retries: 10, minTimeout: 500, maxTimeout: 500 }
  );
}
export async function getApproximateNumberOfMessages(
  queueUrl: string
): Promise<number> {
  const queueAttributesResponse = await sqs
    .getQueueAttributes({
      QueueUrl: queueUrl,
      AttributeNames: APPROXIMATE_NUMBER_OF_MESSAGES_ATTRIBUTES,
    })
    .promise();
  const attributes = queueAttributesResponse.Attributes as Record<
    string,
    string
  >;
  return Object.values(attributes)
    .map(parseInt)
    .reduce((a, b) => a + b, 0);
}
export async function purgeQueueMessages(queueUrl: string): Promise<void> {
  await sqs
    .purgeQueue({
      QueueUrl: queueUrl,
    })
    .promise();
}
export async function pollSQSMessages(
  queueUrl: string
): Promise<SQS.MessageList> {
  const params = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 600, // we don't want messages to be available once consumed during the test execution
    WaitTimeSeconds: 1,
  };
  const { Messages } = await sqs.receiveMessage(params).promise();
  return Messages || [];
}