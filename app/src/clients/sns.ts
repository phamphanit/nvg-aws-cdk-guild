import { AWSError, SNS } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { BaseEventPayload } from '../types';

export function publishEvent<T>(
  topicArn: string,
  payload: BaseEventPayload<T>
): Promise<PromiseResult<SNS.PublishResponse, AWSError>> {
  return new SNS({
    region: process.env.AWS_REGION,
  })
    .publish({
      TopicArn: topicArn,
      Message: JSON.stringify(payload),
    })
    .promise();
}
