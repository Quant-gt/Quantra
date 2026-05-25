"use client";

import React, { useState, useEffect } from 'react';
import { Check, X, Search, FileText, AlertTriangle, UserCheck, Clock } from 'lucide-react';

interface KYCRequest {
  id: string;
  user_name: string;
  email: string;
  pan_number: string;
  is_ria: boolean;
  sebi_registration_number: string | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
}

export default function ComplianceDashboard() {
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verificationResults, setVerificationResults] = useState<Record<string, {is_match: boolean, registered_name: string, message: string}>>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/v1/admin/kyc');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    if (!confirm(`Are you sure you want to ${action} this KYC application?`)) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`/api/v1/admin/kyc/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      if (res.ok) {
        setRequests(requests.filter(req => req.id !== id));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to process application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleVerify = async (id: string, pan_number: string, expected_name: string) => {
    setVerifyingId(id);
    try {
      const res = await fetch(`/api/v1/admin/kyc/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pan_number, expected_name })
      });
      
      const data = await res.json();
      if (res.ok) {
        setVerificationResults(prev => ({
          ...prev,
          [id]: data.data
        }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to verify PAN');
    } finally {
      setVerifyingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading compliance queue...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#0B0F19]">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[#30363D] bg-[#0D1117] flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserCheck className="text-blue-500" />
            Creator KYC Verification
          </h2>
          <p className="text-sm text-gray-400 mt-1">Review PAN and SEBI Registration details for aspiring creators.</p>
        </div>
        
        <div className="bg-[#1C2128] border border-[#30363D] rounded-lg px-4 py-2 flex items-center gap-2">
          <Clock size={16} className="text-yellow-500" />
          <span className="text-sm font-bold text-white">{requests.length} Pending</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="bg-[#1C2128] border border-[#30363D] rounded-xl overflow-hidden shadow-2xl">
          
          <div className="p-4 border-b border-[#30363D] flex items-center gap-4 bg-[#0D1117]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="Search by PAN, SEBI No. or Email..." 
                className="w-full bg-[#161B22] border border-[#30363D] rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#161B22] border-b border-[#30363D] text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4 font-bold">Applicant Details</th>
                <th className="px-6 py-4 font-bold">PAN Verification</th>
                <th className="px-6 py-4 font-bold">SEBI RIA Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <Check size={32} className="mx-auto mb-3 text-green-500/50" />
                    <p className="text-sm">Queue is empty. All caught up!</p>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="border-b border-[#30363D] hover:bg-[#161B22]/50 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-inner">
                          {req.user_name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{req.user_name}</div>
                          <div className="text-xs text-gray-500">{req.email}</div>
                          <div className="text-xs text-gray-600 mt-1">Submitted: {new Date(req.submitted_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1.5 bg-[#0D1117] border border-[#30363D] px-2.5 py-1 rounded text-xs font-mono text-white mb-2">
                        <FileText size={12} className="text-gray-400" />
                        {req.pan_number}
                      </div>
                      
                      {verificationResults[req.id] ? (
                        <div className={`text-xs p-2 rounded border ${verificationResults[req.id].is_match ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                          <div className="font-bold flex items-center gap-1">
                            {verificationResults[req.id].is_match ? <Check size={12} /> : <X size={12} />}
                            {verificationResults[req.id].is_match ? 'Name Matched' : 'Name Mismatch'}
                          </div>
                          <div className="mt-1 text-gray-400">NSDL: {verificationResults[req.id].registered_name}</div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => !verifyingId && handleVerify(req.id, req.pan_number, req.user_name)}
                          className={`text-xs text-blue-400 flex items-center gap-1 cursor-pointer hover:underline ${verifyingId === req.id ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                          <Search size={10} /> 
                          {verifyingId === req.id ? 'Verifying...' : 'Verify with NSDL'}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {req.is_ria ? (
                        <div>
                          <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/30 text-green-400 px-2.5 py-1 rounded text-xs font-bold mb-1">
                            Registered RIA
                          </div>
                          <div className="text-xs font-mono text-gray-300 bg-[#0D1117] px-2 py-0.5 rounded border border-[#30363D] inline-block">
                            {req.sebi_registration_number}
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-2.5 py-1 rounded text-xs font-bold">
                          <AlertTriangle size={12} /> Non-Advisory
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          disabled={processingId === req.id}
                          onClick={() => handleAction(req.id, 'reject')}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
                          title="Reject Application"
                        >
                          <X size={18} />
                        </button>
                        <button 
                          disabled={processingId === req.id}
                          onClick={() => handleAction(req.id, 'approve')}
                          className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Check size={16} /> {processingId === req.id ? 'Processing...' : 'Approve'}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
