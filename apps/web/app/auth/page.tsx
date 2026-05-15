"use client";

import AuthForm from '@/components/auth/AuthForm';
import { motion } from 'framer-motion';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] overflow-hidden relative">
      
      {/* Animated Glowing Orbs for Mesh Gradient Effect */}
      <motion.div 
        animate={{ 
          x: [0, 50, 0],
          y: [0, -50, 0],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl -z-10"
      />
      <motion.div 
        animate={{ 
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl -z-10"
      />
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      {/* Auth Card */}
      <div className="z-10 w-full max-w-md p-8 bg-[#161B22]/80 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent mb-2">
            QUANTRA
          </h1>
          <p className="text-gray-400 text-sm">Your Algorithm. Your Mantra. Your Edge.</p>
        </div>
        
        <AuthForm />
      </div>
    </div>
  );
}
