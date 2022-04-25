
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';
import { publishEvent } from '../clients/sns';
import { BaseEventPayload, ContactRequest } from '../types';

export const handleContactRequest = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {


    const contactRequest = typeof event.body == 'object' ? event.body : JSON.parse(event.body) as ContactRequest;

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: `Sent request from ${contactRequest?.email}`
    }

    if (contactRequest) {
        const contactRequestEvent: BaseEventPayload<ContactRequest> = {
            id: v4(),
            source: 'request',
            data: contactRequest
        }
        await publishEvent(process.env.SNS_TOPIC_ARN!, contactRequestEvent);
    }

    return result;
} 