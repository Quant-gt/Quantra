"use client";

import React, { useState, useEffect } from 'react';
import { User, Key, Shield, Settings2, Save, Trash2, Eye, EyeOff, CheckCircle2, AlertCircle, Copy, Check, Info } from 'lucide-react';
import { toast } from 'sonner';

import CreatorOnboarding from '@/components/settings/CreatorOnboarding';
import RiskManagement from '@/components/settings/RiskManagement';
import BrokerConnectionModal from '@/components/settings/BrokerConnectionModal';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('api');
  const [showKey, setShowKey] = useState<number | null>(null);
  const [copiedKey, setCopiedKey] = useState<number | null>(null);
  const [isBrokerModalOpen, setIsBrokerModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('user');

  const [profileData, setProfileData] = useState({
    firstName: 'Quant',
    lastName: 'Admin',
    email: 'admin@sigmaspire.io'
  });

  useEffect(() => {
    const storedProfile = localStorage.getItem('sigmaspire_profile');
    if (storedProfile) {
      setProfileData(JSON.parse(storedProfile));
    }
    const storedRole = localStorage.getItem('sigmaspire_role');
    if (storedRole) {
      setCurrentView(storedRole);
    }
  }, []);

  const handleSaveProfile = () => {
    localStorage.setItem('sigmaspire_profile', JSON.stringify(profileData));
    localStorage.setItem('sigmaspire_role', currentView);
    toast.success("Profile settings saved successfully!");
  };

  const [apiKeys, setApiKeys] = useState([
    { id: 1, provider: "Fyers", status: "Connected", appId: "H5XXXXXX", addedAt: "12 May, 2026", validUntil: "12 May, 2027" },
    { id: 2, provider: "Zerodha Kite", status: "Expired", appId: "KTXXXXXX", addedAt: "01 Jan, 2026", validUntil: "01 Apr, 2026" },
  ]);

  const handleCopy = (id: number) => {
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleBrokerSuccess = (provider: string, appId: string) => {
    const newKey = {
      id: Date.now(),
      provider,
      status: "Connected",
      appId,
      addedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      validUntil: new Date(Date.now() + 31536000000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setApiKeys([newKey, ...apiKeys]);
  };

  return (
    <div className="p-4 md:p-8 bg-[#0D1117] min-h-full max-w-6xl mx-auto space-y-8 relative">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-[#58A6FF]/10 rounded-lg border border-[#58A6FF]/20">
            <Settings2 className="text-[#58A6FF]" size={28} />
          </div>
          Platform Settings
        </h1>
        <p className="text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
          Manage your account preferences, broker integrations, and security configurations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          {[
            { id: 'profile', label: 'Profile Settings', icon: <User size={18} /> },
            { id: 'api', label: 'API Management', icon: <Key size={18} /> },
            { id: 'creator', label: 'Creator Center', icon: <Shield size={18} /> },
            { id: 'risk', label: 'Risk Management', icon: <AlertCircle size={18} /> },
            { id: 'security', label: 'Security & 2FA', icon: <Shield size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id 
                ? 'bg-[#1C2128] text-white border border-[#30363D] shadow-sm' 
                : 'text-gray-400 hover:text-white hover:bg-[#161B22]'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-[#58A6FF]' : 'text-gray-500'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#161B22] border border-[#30363D] rounded-xl shadow-xl overflow-hidden min-h-[500px]">
          {activeTab === 'api' && (
            <div className="flex flex-col">
              <div className="p-6 border-b border-[#30363D] bg-[#0D1117]/50 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Broker API Connections</h2>
                  <p className="text-sm text-gray-400 mt-1">Connect your trading accounts to enable live execution.</p>
                </div>
                <button 
                  onClick={() => setIsBrokerModalOpen(true)}
                  className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md text-sm font-bold transition-all shadow-lg"
                >
                  Add Connection
                </button>
              </div>

              <div className="p-6 flex-1 space-y-6">
                <div className="bg-[#D29922]/10 border border-[#D29922]/30 rounded-lg p-4 flex gap-3 text-[#D29922]">
                  <Info className="shrink-0 mt-0.5" size={18} />
                  <div className="text-sm">
                    <strong className="block mb-1">Security Notice</strong>
                    SigmaSpire encrypts all API secrets at rest using AES-256-GCM. We never store your broker passwords or 2FA TOTP secrets.
                  </div>
                </div>

                <div className="space-y-4">
                  {apiKeys.map(key => (
                    <div key={key.id} className="border border-[#30363D] bg-[#0D1117] rounded-lg p-5 group hover:border-[#8B949E] transition-colors relative overflow-hidden">
                      {key.status === 'Connected' && (
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#39D353]/5 blur-[40px] pointer-events-none" />
                      )}
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                            key.provider === 'Fyers' ? 'bg-[#58A6FF]/10 border-[#58A6FF]/30 text-[#58A6FF]' : 'bg-[#D29922]/10 border-[#D29922]/30 text-[#D29922]'
                          }`}>
                            <Key size={20} />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg">{key.provider}</h3>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">App ID: {key.appId}</div>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-bold tracking-wider uppercase ${
                          key.status === 'Connected' ? 'bg-[#238636]/10 border-[#238636]/30 text-[#39D353]' : 'bg-[#F85149]/10 border-[#F85149]/30 text-[#F85149]'
                        }`}>
                          {key.status === 'Connected' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          {key.status}
                        </div>
                      </div>

                      <div className="bg-[#1C2128] border border-[#30363D] rounded p-3 mb-4 flex justify-between items-center relative z-10">
                        <div className="font-mono text-sm text-gray-300 tracking-widest select-all">
                          {showKey === key.id ? "•".repeat(24) + "xyz98" : "••••••••••••••••••••••••••••••••"}
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setShowKey(showKey === key.id ? null : key.id)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#30363D] rounded transition-colors"
                          >
                            {showKey === key.id ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button 
                            onClick={() => handleCopy(key.id)}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-[#30363D] rounded transition-colors"
                          >
                            {copiedKey === key.id ? <Check size={16} className="text-[#39D353]" /> : <Copy size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 relative z-10 border-t border-[#30363D] pt-4">
                        <div>Added: {key.addedAt}</div>
                        <div>Valid until: {key.validUntil}</div>
                        <button className="text-[#F85149] hover:bg-[#F85149]/10 px-2 py-1 rounded transition-colors font-medium">
                          Revoke Access
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white tracking-tight mb-6">Profile Settings</h2>
              <div className="space-y-6 max-w-2xl">
                <div className="flex gap-6 items-center">
                  <div className="w-20 h-20 rounded-full bg-[#21262D] border-2 border-[#30363D] flex items-center justify-center text-gray-400 text-2xl font-bold shrink-0">
                    QA
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name</label>
                    <input 
                      type="text" 
                      value={profileData.firstName} 
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2 text-white focus:border-[#58A6FF] outline-none transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name</label>
                    <input 
                      type="text" 
                      value={profileData.lastName} 
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2 text-white focus:border-[#58A6FF] outline-none transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    value={profileData.email} 
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full bg-[#0D1117] border border-[#30363D] rounded-lg px-4 py-2 text-white focus:border-[#58A6FF] outline-none transition-colors" 
                  />
                </div>

                <div className="pt-4 border-t border-[#30363D]">
                  <div className="flex items-center justify-between bg-[#0D1117]/50 border border-[#30363D] p-4 rounded-lg mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">Active Dashboard Role</h3>
                      <p className="text-xs text-gray-500">Switch between Investor and Developer workspaces.</p>
                    </div>
                    <div className="flex bg-[#1C2128] p-1 rounded-lg border border-[#30363D]">
                      <button 
                        onClick={() => setCurrentView('user')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${currentView === 'user' ? 'bg-[#238636] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                        Investor
                      </button>
                      <button 
                        onClick={() => setCurrentView('creator')}
                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${currentView === 'creator' ? 'bg-[#8B5CF6] text-white shadow' : 'text-gray-400 hover:text-white'}`}
                      >
                        Developer
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSaveProfile}
                      className="bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-2 rounded-md text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                      <Save size={16} /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'creator' && (
            <CreatorOnboarding />
          )}

          {activeTab === 'risk' && (
            <RiskManagement />
          )}

          {(activeTab === 'security') && (
            <div className="p-6 flex flex-col items-center justify-center text-center h-[400px] text-gray-500">
              <Settings2 size={48} className="mb-4 text-[#30363D]" />
              <h3 className="text-xl font-bold text-white mb-2">Section Under Construction</h3>
              <p className="text-sm max-w-sm">This module is being upgraded to support institutional-grade features.</p>
            </div>
          )}
        </div>
      </div>

      <BrokerConnectionModal 
        isOpen={isBrokerModalOpen} 
        onClose={() => setIsBrokerModalOpen(false)} 
        onSuccess={handleBrokerSuccess} 
      />
    </div>
  );
}

