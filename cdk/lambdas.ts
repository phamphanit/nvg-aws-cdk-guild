import { Duration } from "aws-cdk-lib";
import { Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Topic } from "aws-cdk-lib/aws-sns";
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