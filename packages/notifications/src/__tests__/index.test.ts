import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.hoisted(() => {
  process.env.BREVO_API_KEY = 'mock-brevo-key';
  process.env.TELEGRAM_BOT_TOKEN = 'mock-telegram-token';
});

const { mockSendTransacEmail } = vi.hoisted(() => ({
  mockSendTransacEmail: vi.fn(),
}));

vi.mock('@getbrevo/brevo', () => {
  return {
    TransactionalEmailsApi: function (this: any) {
      this.setApiKey = vi.fn();
      this.sendTransacEmail = mockSendTransacEmail;
    },
    TransactionalEmailsApiApiKeys: {
      apiKey: 'apiKey',
    },
    SendSmtpEmail: function () {
      return {};
    },
  };
});

import { NotificationService } from '../index';

describe('NotificationService', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  describe('sendEmail', () => {
    it('should return false if brevoClient is not configured', async () => {
      // Create a temporary class instance or temporarily clear client to force null
      // We can manipulate the private static variable via indexing
      const originalClient = (NotificationService as any).brevoClient;
      (NotificationService as any).brevoClient = null;

      const result = await NotificationService.sendEmail('test@example.com', 'Subject', '<p>Hello</p>');
      expect(result).toBe(false);

      (NotificationService as any).brevoClient = originalClient;
    });

    it('should send email successfully if brevoClient is configured', async () => {
      mockSendTransacEmail.mockResolvedValue({ body: { messageId: '12345' } });

      const result = await NotificationService.sendEmail('test@example.com', 'Subject', '<p>Hello</p>');

      expect(mockSendTransacEmail).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if brevoClient.sendTransacEmail throws an error', async () => {
      mockSendTransacEmail.mockRejectedValue(new Error('Brevo error'));

      const result = await NotificationService.sendEmail('test@example.com', 'Subject', '<p>Hello</p>');

      expect(result).toBe(false);
    });
  });

  describe('sendTelegramMessage', () => {
    it('should return false if telegramBotToken is not set', async () => {
      const originalToken = (NotificationService as any).telegramBotToken;
      (NotificationService as any).telegramBotToken = null;

      const result = await NotificationService.sendTelegramMessage('123456', 'Hello Telegram');
      expect(result).toBe(false);

      (NotificationService as any).telegramBotToken = originalToken;
    });

    it('should send telegram message successfully', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
      });
      vi.stubGlobal('fetch', mockFetch);

      const result = await NotificationService.sendTelegramMessage('123456', 'Hello Telegram');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/botmock-telegram-token/sendMessage'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            chat_id: '123456',
            text: 'Hello Telegram',
            parse_mode: 'HTML',
          }),
        })
      );
      expect(result).toBe(true);
    });

    it('should return false if telegram API response is not ok', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        text: async () => 'Unauthorized',
      });
      vi.stubGlobal('fetch', mockFetch);

      const result = await NotificationService.sendTelegramMessage('123456', 'Hello Telegram');
      expect(result).toBe(false);
    });

    it('should return false if fetch throws an error', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      vi.stubGlobal('fetch', mockFetch);

      const result = await NotificationService.sendTelegramMessage('123456', 'Hello Telegram');
      expect(result).toBe(false);
    });
  });

  describe('notifyTradeExecution', () => {
    it('should trigger email and telegram if both are enabled', async () => {
      mockSendTransacEmail.mockResolvedValue({ body: { messageId: '12345' } });
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', mockFetch);

      const prefs = {
        email_trade_alerts: true,
        telegram_trade_alerts: true,
        telegram_chat_id: '123456',
        user_email: 'user@example.com',
      };

      const tradeDetails = {
        symbol: 'AAPL',
        qty: 10,
        price: 150,
        action: 'BUY',
        status: 'filled',
      };

      await NotificationService.notifyTradeExecution('user123', prefs, tradeDetails);

      expect(mockSendTransacEmail).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalled();
    });

    it('should not trigger notifications if disabled', async () => {
      const prefs = {
        email_trade_alerts: false,
        telegram_trade_alerts: false,
      };

      await NotificationService.notifyTradeExecution('user123', prefs, {
        symbol: 'AAPL',
        qty: 10,
        price: 150,
        action: 'BUY',
        status: 'filled',
      });

      expect(mockSendTransacEmail).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('notifyComplianceThrottle', () => {
    it('should trigger notifications according to compliance prefs', async () => {
      mockSendTransacEmail.mockResolvedValue({ body: { messageId: '123' } });
      const mockFetch = vi.fn().mockResolvedValue({ ok: true });
      vi.stubGlobal('fetch', mockFetch);

      const prefs = {
        email_compliance_alerts: true,
        push_compliance_alerts: true,
        telegram_chat_id: '123456',
        user_email: 'user@example.com',
      };

      await NotificationService.notifyComplianceThrottle('user123', prefs, 'OPS Limit exceeded');

      expect(mockSendTransacEmail).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalled();
    });
  });
});
