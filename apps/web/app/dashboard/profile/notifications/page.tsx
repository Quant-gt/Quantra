"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, ShieldCheck } from "lucide-react";

export default function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState({
    push_trade_alerts: true,
    email_trade_alerts: false,
    telegram_trade_alerts: false,
    push_compliance_alerts: true,
    email_compliance_alerts: true,
    email_marketing: true,
  });

  const [telegramLinked, setTelegramLinked] = useState(false);

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Notification Settings</h1>
          <p className="text-white/60">
            Control how and when you receive alerts from SIGMASPIRE.
          </p>
        </div>

        <div className="space-y-6">
          {/* Channel Setup: Telegram */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> Telegram Integration
                </h3>
                <p className="text-sm text-white/60 mt-1">
                  Receive real-time trade alerts directly in your Telegram app.
                </p>
              </div>
              <button
                onClick={() => setTelegramLinked(!telegramLinked)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  telegramLinked 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {telegramLinked ? "Unlink Account" : "Link Telegram"}
              </button>
            </div>

            {!telegramLinked && (
              <div className="bg-white/5 p-4 rounded-lg mt-4 text-sm text-white/70">
                <p className="font-semibold mb-1">To link your account:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Search for <span className="text-primary font-mono">@SigmaSpireAlgoBot</span> on Telegram.</li>
                  <li>Send the command <span className="text-primary font-mono">/start</span>.</li>
                  <li>Enter the verification code the bot gives you here.</li>
                </ol>
              </div>
            )}
          </div>

          {/* Notification Toggles */}
          <div className="glass-panel p-6 rounded-xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-6">Alert Preferences</h3>

            <div className="space-y-6">
              {/* Trade Alerts */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="font-semibold text-white">Trade Execution Alerts</p>
                  <p className="text-sm text-white/50">Receive alerts when a strategy places or completes a trade.</p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={prefs.push_trade_alerts} onChange={() => togglePref('push_trade_alerts')} className="accent-primary" />
                    <span className="text-sm text-white/70 flex items-center gap-1"><Bell className="w-4 h-4" /> Push</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={prefs.email_trade_alerts} onChange={() => togglePref('email_trade_alerts')} className="accent-primary" />
                    <span className="text-sm text-white/70 flex items-center gap-1"><Mail className="w-4 h-4" /> Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={prefs.telegram_trade_alerts} onChange={() => togglePref('telegram_trade_alerts')} className="accent-primary" disabled={!telegramLinked} />
                    <span className={`text-sm flex items-center gap-1 ${telegramLinked ? 'text-white/70' : 'text-white/30'}`}><MessageSquare className="w-4 h-4" /> Telegram</span>
                  </label>
                </div>
              </div>

              {/* Compliance Alerts */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                  <p className="font-semibold text-white flex items-center gap-2">
                    Compliance & Safety <ShieldCheck className="w-4 h-4 text-green-500" />
                  </p>
                  <p className="text-sm text-white/50">Mandatory alerts for SEBI compliance and kill switch activations.</p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                    <input type="checkbox" checked={true} disabled className="accent-primary" />
                    <span className="text-sm text-white/70 flex items-center gap-1"><Bell className="w-4 h-4" /> Push</span>
                  </label>
                  <label className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                    <input type="checkbox" checked={true} disabled className="accent-primary" />
                    <span className="text-sm text-white/70 flex items-center gap-1"><Mail className="w-4 h-4" /> Email</span>
                  </label>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="font-semibold text-white">Platform Updates & Newsletter</p>
                  <p className="text-sm text-white/50">Stay up to date with new features and popular strategies.</p>
                </div>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={prefs.email_marketing} onChange={() => togglePref('email_marketing')} className="accent-primary" />
                    <span className="text-sm text-white/70 flex items-center gap-1"><Mail className="w-4 h-4" /> Email</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

