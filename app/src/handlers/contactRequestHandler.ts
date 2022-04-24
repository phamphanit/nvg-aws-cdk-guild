
import { APIGatewayEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { publishEvent } from '../clients/sns';
import { BaseEventPayload, ContactRequest } from '../types';

type contactRequestEventPayload = BaseEventPayload<ContactRequest>
export const handleContactRequest = async (event: APIGatewayEvent) : Promise<APIGatewayProxyResult> => {

    const result : APIGatewayProxyResult = {
        statusCode: 200,
        body: "Success"
    }
    return result;
} 