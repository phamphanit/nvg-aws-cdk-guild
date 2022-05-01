import { CfnOutput } from "aws-cdk-lib";
import { ITopic, Topic } from "aws-cdk-lib/aws-sns";
import { SqsSubscription, SqsSubscriptionProps } from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs/lib/construct";

export function createSNSTopic(
  scope: Construct,
): Topic {
  const topic = new Topic(scope, 'Topic', {
    displayName: 'Contact Request topic',
    topicName: `${process.env.UNIQUE_SUFFIX}-contactRequest`,
  });

  new CfnOutput(scope, 'SNSContactTopicArn', {
    value: topic.topicArn,
  });

  return topic;
}

export function subscribeSQSToSNSTopic(
  topic: ITopic,
  sqs: Queue,
  subscriptionProps?: SqsSubscriptionProps
): void {
  const sqsSubscription = new SqsSubscription(sqs, subscriptionProps);
  topic.addSubscription(sqsSubscription);
}