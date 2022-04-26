import { SNSMessage, SQSEvent, SQSRecord } from "aws-lambda";
import { uploadEmailBodyToS3 } from "../../../cdk/s3";
import { pushContactRequestToSQS } from "../../../cdk/sqs";
import { BaseEventPayload, ContactRequest } from "../types";

const EMAIL_BLACKLIST = ['blacklist@gmail.com', 'noreply@gmail.com'];

export const handleSendEmail = async (event: SQSEvent): Promise<void> => {
  await Promise.all(event.Records.map(async record => {

    const notification = JSON.parse(record.body) as SNSMessage;
    const contactRequest = JSON.parse(notification.Message) as BaseEventPayload<ContactRequest>;
    const {
      data: {
        email,
      }
    } = contactRequest;

    try {
      if (EMAIL_BLACKLIST.includes(email)) {
        await pushContactRequestToSQS(contactRequest);
        console.log(`fail to send email from ${email}`);
      }
      else {
        //simulate sending email
        await uploadEmailBodyToS3(process.env.AWS_REGION!, process.env.CONTACT_BUCKET_NAME!, JSON.stringify(contactRequest), `email/${contactRequest.id}`);
        console.log(`Email sent successfully: from ${email}`);
      }
    }
    catch (error) {
      throw new Error(`Fail to consume message: ${error}`);
    }
  }))
}