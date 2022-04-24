import { Stack } from "aws-cdk-lib";
import { ApiDefinition, IRestApi, RestApi, SpecRestApi } from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";
import { readFileSync } from "fs";
import * as YAML from 'yaml'; 

export function createApi(
    scope: Stack,
    lambdas: {
        contactRequestLambda: Function
    }
): IRestApi {

    const file = readFileSync('../openapi.yml', 'utf8')
    .replace(
        /\${CONTACT_REQUEST_LAMBDA_ARN}/g,
        lambdas.contactRequestLambda.functionArn
    )
    return new SpecRestApi(scope, 'vincent-guild-api', {
        apiDefinition: ApiDefinition.fromInline(YAML.parse(file)),
    })
}