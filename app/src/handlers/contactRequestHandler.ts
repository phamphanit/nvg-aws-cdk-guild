
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ContactRequest } from '../types';

export const handleContactRequest = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {


    const contactRequest = typeof event.body == 'object' ? event.body : JSON.parse(event.body) as ContactRequest;

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: `Sent request from ${contactRequest?.email}`
    }
    return result;
} 