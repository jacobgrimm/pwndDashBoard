import { S3Event, Context } from "aws-lambda";
import AWS from "aws-sdk";

interface lambdaResponse {
  statusCode: Number;
  body: string;
}

export const handler = async (
  event: S3Event,
  context: Context
): Promise<lambdaResponse> => {
  console.log("Event: ", JSON.stringify(event, null, 2));

  interface S3Record {
    bucketName: string;
    objectKey: string;
    eventTime: string;
  }

  const recordArray: S3Record[] = event.Records.map((record) => ({
    bucketName: record.s3.bucket.name,
    objectKey: record.s3.object.key,
    eventTime: record.eventTime,
  }));

  recordArray.forEach((record: S3Record) => {
    console.log(
      `File uploaded: ${record.objectKey} in bucket: ${record.bucketName}`
    );
  });

  //TODO: ADD s3 presigned urls to emails as well

  const emailBody = recordArray
    .map((record: S3Record) => {
      const bucketName = record.bucketName;
      const objectKey = record.objectKey;
      return `
      - Bucket: ${bucketName}
      - File Path: ${objectKey}
      - Timestamp: ${record.eventTime}
      `;
    })
    .join("\n");

  const ses = new AWS.SES();
  try {
    const emailParams = {
      Source: process.env.SES_EMAIL_SENDER || "jacobgrimm@ymail.com",
      Destination: {
        ToAddresses: [
          process.env.SES_EMAIL_RECIPIENT || "jacobgrimm@ymail.com",
        ],
      },
      Message: {
        Subject: { Data: "New S3 Object(s) Created" },
        Body: {
          Text: {
            Data: `The following files were uploaded to S3:\n${emailBody}`,
          },
        },
      },
    };

    await ses.sendEmail(emailParams).promise();
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    return { statusCode: 500, body: "Failed to send email" };
  }

  return { statusCode: 200, body: "Email sent" };
};
