import { Bucket } from "aws-cdk-lib/aws-s3";
import { S3 } from "aws-sdk";
import { Construct } from "constructs";

export const createContactBucket = (
  scope: Construct,
): Bucket =>
  new Bucket(scope, 'ConfigBucket', {
    bucketName: `${process.env.UNIQUE_SUFFIX}-contact-request`,
    publicReadAccess: false,
    autoDeleteObjects: false,
    versioned: true,
  });

export async function uploadEmailBodyToS3(
  awsRegion: string,
  bucketName: string,
  content: string,
  key: string
): Promise<{ key: string }> {
  await new S3({
    apiVersion: '2006-03-01',
    region: awsRegion,
  })
    .putObject({
      Bucket: bucketName,
      Key: key,
      Body: content,
    })
    .promise();

  return { key };
}