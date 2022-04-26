import { CfnOutput, Duration } from "aws-cdk-lib";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { SQS } from "aws-sdk";
import { Construct } from "constructs/lib/construct";
import { BaseEventPayload, ContactRequest } from "../app/src/types";


export const createContactRequestQueue = (scope: Construct) => {
  const queue = new Queue(scope, `ContactRequestQueue`, {
    retentionPeriod: Duration.days(14),
    queueName: 'vincent-contact-request-queue',
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
    queueName: 'vincent-maintenance-queue',
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
