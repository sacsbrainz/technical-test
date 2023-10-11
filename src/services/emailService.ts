import sendgrid from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

export async function sendEmail(
  to: string,
  subject: string = "Email Verification",
  text: string
) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);

  const message = {
    to: to,
    from: process.env.EMAIL_USER as string,
    subject: subject,
    text: text,
  };

  return sendgrid.send(message);
}
