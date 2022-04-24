import { Duration } from "aws-cdk-lib";
import { Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

const HANDLERS_PATH = './app/src/handlers';
const DEFAULT_LAMBDA_SETTINGS = {
  memorySize: 512,
  runtime: Runtime.NODEJS_14_X,
  timeout: Duration.seconds(6),
}

export function createContactRequestLambda(
    scope: Construct
) : Function {
    const lambdaFct = new NodejsFunction(scope, 'ContactRequest', {
        ...DEFAULT_LAMBDA_SETTINGS,
        entry: `${HANDLERS_PATH}/contactRequestHandler.ts`,
    })
    return lambdaFct;
}