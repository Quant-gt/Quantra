"use client";

import React from 'react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-white p-10 rounded-[24px] shadow-sm border border-slate-200">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Join Quantra Pro</h2>
            <p className="text-slate-500 text-sm mt-2">Start automating your edge today.</p>
          </div>

          <form className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-900" placeholder="Alex Rivera" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-900" placeholder="alex@quantra.io" />
            </div>

            {/* Phone with Country Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
              <div className="relative flex">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 border-r border-slate-200 cursor-pointer hover:bg-slate-100 rounded-l-xl">
                  <img src="https://flagcdn.com/us.svg" className="w-5 h-3 mr-1" alt="USA" />
                  <span className="text-sm font-semibold text-slate-700">+1</span>
                </div>
                <input type="tel" className="w-full pl-20 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition text-slate-900" placeholder="(555) 000-0000" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" placeholder="••••••••" />
            </div>

            <button className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100 mt-2">
              Create Pro Account
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-sm text-slate-500">
            Already using Quantra? 
            <a href="/auth" className="text-slate-900 font-bold hover:text-emerald-600">Sign In</a>
          </div>
        </div>
      </div>
    </div>
  );
}

