import axios from 'axios';
import { clearSQSMessages, pollSQSMessages } from '../../../cdk/sqs';
import * as retry from 'async-retry'
import { BaseEventPayload, ContactRequest } from '../../src/types';

const CONTACT_REQUEST_PAYLOAD = {
  firstName: "Vicent",
  lastName: "Pham",
  message: "heyy",
  email: "vincent@gmail.com"
}
describe('handle contact request', () => {
  const apiEndpoint = 'https://qi043onsub.execute-api.us-east-1.amazonaws.com/prod/contact-request';
  const contactServiceQueureUrl = 'https://sqs.us-east-1.amazonaws.com/765217411273/vincent-contact-request-queue';
  const maintenanceQueureUrl = 'https://sqs.us-east-1.amazonaws.com/765217411273/vincent-maintenance-queue';

  beforeAll(async () => {
    await Promise.all([
      clearSQSMessages(contactServiceQueureUrl),
      clearSQSMessages(maintenanceQueureUrl),
    ])
  }, 10000)
  it('should send contact request successfully', async () => {
    const response = await axios.post(apiEndpoint, {
      ...CONTACT_REQUEST_PAYLOAD,
      email: 'blacklist@gmail.com'
    })
    expect(response.status).toBe(200);
  }, 5000)

  it('should send bounce email when email address is not valid', async () => {
    await retry(
      async () => {
        const messages = await pollSQSMessages(
          maintenanceQueureUrl
        );
        const events = messages.map(
          (message) => {
            return JSON.parse(
              JSON.parse(message.Body!).Message
            ) as BaseEventPayload<ContactRequest>
          }
        );
        expect(events.length).toBeGreaterThanOrEqual(1);
      },
      { retries: 10, minTimeout: 3000, maxTimeout: 3000 }
    )
  }, 50000)
})