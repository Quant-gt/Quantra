import * as brevo from '@getbrevo/brevo';

export class NotificationService {
  private static brevoClient = (() => {
    if (!process.env.BREVO_API_KEY) return null;
    const client = new brevo.TransactionalEmailsApi();
    client.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
    return client;
  })();

  private static telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

  /**
   * Send an email using Resend
   */
  static async sendEmail(to: string, subject: string, html: string) {
    if (!this.brevoClient) {
      console.warn('[NotificationService] BREVO_API_KEY is not set. Skipping email to', to);
      return false;
    }

    try {
      const email = new brevo.SendSmtpEmail();
      email.subject = subject;
      email.htmlContent = html;
      email.sender = { name: 'Quantra', email: 'notifications@quantra.trade' }; // Update domain as needed
      email.to = [{ email: to }];

      const { body } = await this.brevoClient.sendTransacEmail(email);
      console.log(`[NotificationService] Email sent to ${to}:`, body.messageId);
      return true;
    } catch (error) {
      console.error('[NotificationService] Error sending email:', error);
      return false;
    }
  }

  /**
   * Send a Telegram message via Bot API
   */
  static async sendTelegramMessage(chatId: string, message: string) {
    if (!this.telegramBotToken) {
      console.warn('[NotificationService] TELEGRAM_BOT_TOKEN is not set. Skipping telegram to', chatId);
      return false;
    }

    try {
      const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('[NotificationService] Telegram API error:', err);
        return false;
      }
      
      console.log(`[NotificationService] Telegram message sent to ${chatId}`);
      return true;
    } catch (error) {
      console.error('[NotificationService] Error sending telegram message:', error);
      return false;
    }
  }

  /**
   * Notify user of a trade execution (if enabled in their preferences)
   */
  static async notifyTradeExecution(
    userId: string,
    prefs: any,
    tradeDetails: { symbol: string; qty: number; price: number; action: string; status: string }
  ) {
    const { email_trade_alerts, telegram_trade_alerts, telegram_chat_id, user_email } = prefs;
    
    const subject = `Trade ${tradeDetails.status.toUpperCase()}: ${tradeDetails.action} ${tradeDetails.qty} ${tradeDetails.symbol}`;
    const message = `
      <b>Trade Execution Alert</b>
      Status: ${tradeDetails.status}
      Action: ${tradeDetails.action}
      Symbol: ${tradeDetails.symbol}
      Quantity: ${tradeDetails.qty}
      Price: ${tradeDetails.price}
    `;

    const promises = [];
    if (email_trade_alerts && user_email) {
      promises.push(this.sendEmail(user_email, subject, message));
    }
    
    if (telegram_trade_alerts && telegram_chat_id) {
      promises.push(this.sendTelegramMessage(telegram_chat_id, message));
    }

    await Promise.allSettled(promises);
  }

  /**
   * Notify user of a compliance throttle (OPS limit)
   */
  static async notifyComplianceThrottle(
    userId: string,
    prefs: any,
    reason: string
  ) {
    const { email_compliance_alerts, push_compliance_alerts, telegram_chat_id, user_email } = prefs;
    
    const subject = `COMPLIANCE ALERT: Action Throttled`;
    const message = `
      <b>SEBI Compliance Guard</b>
      Your strategy was temporarily paused or throttled due to risk guards.
      Reason: ${reason}
      
      Please review your dashboard.
    `;

    const promises = [];
    if (email_compliance_alerts && user_email) {
      promises.push(this.sendEmail(user_email, subject, message));
    }
    
    // Compliance alerts usually map to push, if push maps to telegram we use it
    if (push_compliance_alerts && telegram_chat_id) {
      promises.push(this.sendTelegramMessage(telegram_chat_id, message));
    }

    await Promise.allSettled(promises);
  }
}
