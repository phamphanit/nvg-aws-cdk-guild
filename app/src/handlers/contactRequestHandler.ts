
import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ContactRequest } from '../types';

export const handleContactRequest = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {

    const contactRequest = event.body as unknown as ContactRequest;

    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: "Your request has been sent"
    }
    return result;
} 