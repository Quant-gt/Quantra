import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export function StepBroker({ data, setData }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-gray-300">Choose Broker Integration</span>
        <label className="flex items-center gap-2 cursor-pointer text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 py-1.5 px-3 rounded-lg transition-colors hover:bg-emerald-500/15">
          <input 
            type="checkbox" 
            checked={data.broker_sandbox || false} 
            onChange={(e) => setData({ ...data, broker_sandbox: e.target.checked })}
            className="rounded bg-black border-[#30363D] accent-emerald-500 focus:ring-0 cursor-pointer" 
          />
          Enable Paper Trading Sandbox
        </label>
      </div>

      {!data.broker_sandbox ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { id: 'fyers', name: 'Fyers', desc: 'Direct API Integration' },
            { id: 'zerodha', name: 'Zerodha Kite', desc: 'Kite Connect API' },
            { id: 'angelone', name: 'Angel One', desc: 'SmartAPI Integration' }
          ].map((broker) => (
            <button
              key={broker.id}
              type="button"
              onClick={() => setData({ ...data, broker_name: broker.id, broker_config: {} })}
              className={`p-4 rounded-xl border transition-all text-left flex flex-col justify-between h-24 ${
                data.broker_name === broker.id
                  ? 'border-[#388BFD] bg-[#388BFD]/10 text-white shadow-[0_0_20px_rgba(56,139,253,0.1)] ring-1 ring-[#388BFD]'
                  : 'border-[#30363D] bg-[#0D1117]/50 text-gray-400 hover:bg-[#1C2128]'
              }`}
            >
              <span className="font-bold text-white text-sm">{broker.name}</span>
              <span className="text-[10px] opacity-75">{broker.desc}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-b from-[#238636]/10 to-transparent border border-[#238636]/20 rounded-xl p-6 text-center">
          <CheckCircle2 className="w-12 h-12 text-[#39D353] mx-auto mb-4" />
          <h4 className="font-bold text-white mb-2">Sandbox Environment Active</h4>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Live execution is simulated using virtual capital. You can skip broker configuration and immediately test strategy logic against historical and live market feeds.
          </p>
        </div>
      )}

      {!data.broker_sandbox && data.broker_name && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0D1117] border border-[#30363D] rounded-xl p-6 space-y-4"
        >
          <h4 className="font-bold text-xs text-[#58A6FF] uppercase tracking-wider mb-2">
            {data.broker_name.toUpperCase()} API Config
          </h4>

          {data.broker_name === 'fyers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 font-bold block">Fyers App ID</label>
                <input
                  type="text"
                  required
                  value={data.broker_config?.app_id || ""}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, app_id: e.target.value }
                  })}
                  placeholder="e.g. LJQBMJDTMW-100"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">Get this from Fyers API Dashboard</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 font-bold block">Fyers App Secret</label>
                <input
                  type="password"
                  required
                  value={data.broker_config?.app_secret || ""}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, app_secret: e.target.value }
                  })}
                  placeholder="••••••••••••"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">Provided under your App details</span>
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] text-gray-400 font-bold block">Redirect URI</label>
                <input
                  type="text"
                  required
                  value={data.broker_config?.redirect_uri || "http://127.0.0.1:8000/api/v1/fyers/callback"}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, redirect_uri: e.target.value }
                  })}
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">Must match the Redirect URI configured in your developer portal</span>
              </div>
            </div>
          )}

          {data.broker_name === 'zerodha' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 font-bold block">Kite API Key</label>
                <input
                  type="text"
                  required
                  value={data.broker_config?.api_key || ""}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, api_key: e.target.value }
                  })}
                  placeholder="API Key"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">From Zerodha Kite Connect developer console</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 font-bold block">Kite API Secret</label>
                <input
                  type="password"
                  required
                  value={data.broker_config?.api_secret || ""}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, api_secret: e.target.value }
                  })}
                  placeholder="••••••••••••"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">Keep this secret key secure</span>
              </div>
            </div>
          )}

          {data.broker_name === 'angelone' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 font-bold block">SmartAPI Key</label>
                <input
                  type="text"
                  required
                  value={data.broker_config?.api_key || ""}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, api_key: e.target.value }
                  })}
                  placeholder="SmartAPI Key"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">From SmartAPI dashboard</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 font-bold block">Client ID</label>
                <input
                  type="text"
                  required
                  value={data.broker_config?.client_id || ""}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, client_id: e.target.value }
                  })}
                  placeholder="Client ID (e.g. A12345)"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">Your Angel One client code</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 font-bold block">MPIN</label>
                <input
                  type="password"
                  maxLength={6}
                  required
                  value={data.broker_config?.mpin || ""}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, mpin: e.target.value }
                  })}
                  placeholder="e.g. 123456"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">Your 4-6 digit Angel login PIN</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 font-bold block">TOTP Secret Key</label>
                <input
                  type="password"
                  required
                  value={data.broker_config?.totp_secret || ""}
                  onChange={(e) => setData({
                    ...data,
                    broker_config: { ...data.broker_config, totp_secret: e.target.value }
                  })}
                  placeholder="TOTP Secret Key"
                  className="w-full bg-[#161B22] border border-[#30363D] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#388BFD]"
                />
                <span className="text-[9px] text-gray-500 block">Extracted during Google Authenticator setup</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
