import { CfnOutput, Duration } from "aws-cdk-lib";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs/lib/construct";


export const createContactRequestQueue = (scope: Construct) => {
  const queue = new Queue(scope, `MaintenanceQueue`, {
    retentionPeriod: Duration.days(14),
    queueName: `${process.env.UNIQUE_SUFFIX}-contact-request-queue`,
    deliveryDelay: Duration.minutes(0),
  });

  new CfnOutput(scope, 'MaintenanceQueueUrl', {
    value: queue.queueUrl,
  });

  return queue;
};