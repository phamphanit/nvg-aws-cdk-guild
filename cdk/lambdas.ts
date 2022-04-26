import { Duration } from "aws-cdk-lib";
import { Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Topic } from "aws-cdk-lib/aws-sns";
import { IQueue, Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";

const HANDLERS_PATH = './app/src/handlers';

const DEFAULT_BUNDLING_SETTINGS = {
    target: 'es2020',
    externalModules: ['aws-sdk', 'dd-trace'],
    tsconfig: './tsconfig.json',
};
const DEFAULT_LAMBDA_SETTINGS = {
    bundling: DEFAULT_BUNDLING_SETTINGS,
    memorySize: 512,
    runtime: Runtime.NODEJS_14_X,
    timeout: Duration.seconds(6),
}
export function createContactRequestLambda(
    scope: Construct,
    {
        snsTopic,
    }: {
        snsTopic: Topic
    }
): Function {
    const lambdaFct = new NodejsFunction(scope, 'ContactRequest', {
        ...DEFAULT_LAMBDA_SETTINGS,
        entry: `${HANDLERS_PATH}/contactRequestHandler.ts`,
        handler: 'handleContactRequest',
        environment: {
            SNS_TOPIC_ARN: snsTopic.topicArn,
        },
    })
    snsTopic.grantPublish(lambdaFct);

    return lambdaFct;
}
export function createSendEmailLambda(
    scope: Construct,
    contactBucket: IBucket,
    sqsQueue: IQueue
): Function {
    const lambdaFct = new NodejsFunction(scope, 'SendEmail', {
        ...DEFAULT_LAMBDA_SETTINGS,
        entry: `${HANDLERS_PATH}/sendEmailHandler.ts`,
        handler: 'handleSendEmail',
        environment: {
            SQS_MAINTENANCE_URL: sqsQueue.queueUrl,
            CONTACT_BUCKET_NAME: contactBucket.bucketName
        },
    })

    contactBucket.grantReadWrite(lambdaFct);
    sqsQueue.grantSendMessages(lambdaFct);
    return lambdaFct;
}
export function subscribeLambdaToSQS(
    queue: Queue,
    lambda: Function
  ): void {
    queue.grantConsumeMessages(lambda);
    lambda.addEventSource(new SqsEventSource(queue));
  }