declare module '@getbrevo/brevo' {
  export class TransactionalEmailsApi {
    setApiKey(key: number, value: string): void;
    sendTransacEmail(email: SendSmtpEmail): Promise<{ response: any; body: { messageId: string } }>;
  }
  export class SendSmtpEmail {
    subject: string;
    htmlContent: string;
    sender: { name: string; email: string };
    to: { email: string }[];
  }
  export enum TransactionalEmailsApiApiKeys {
    apiKey = 0
  }
}
