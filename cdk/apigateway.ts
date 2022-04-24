import { Stack } from "aws-cdk-lib";
import { IRestApi, LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { Function } from "aws-cdk-lib/aws-lambda";

export function createApi(
    scope: Stack,
    lambdas: {
        contactRequestLambda: Function
    }
): IRestApi {

    const api = new RestApi(scope, 'vincent-guild-api');

    const contactRequestResouce = api.root.addResource('contact-request');
    contactRequestResouce.addMethod('POST', new LambdaIntegration(lambdas.contactRequestLambda));

    return api;
}