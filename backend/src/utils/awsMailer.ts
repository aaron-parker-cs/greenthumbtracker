import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { emailTrackingRepository } from "../db/repositories/email.tracking.repository";

const sesClient = new SESClient({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Send an email using AWS SES
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string
): Promise<void> {
  // These emails cost my personal money to send, so I'm rate limiting them per day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const emailTracking = await emailTrackingRepository.findByDate(today);
  if (emailTracking && emailTracking.count >= 20) {
    throw new Error("Daily email limit reached");
  } else if (emailTracking) {
    emailTracking.count++;
    await emailTrackingRepository.update(emailTracking);
  } else {
    await emailTrackingRepository.create();
  }

  const fromEmail = "GreenThumb Tracker <no-reply@greenthumbtracker.org>";
  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Html: {
          Data: body,
        },
      },
    },
    Source: fromEmail,
  });

  await sesClient.send(command);
}
