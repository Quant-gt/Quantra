"use client";

import dynamic from 'next/dynamic';
import React from 'react';

const VisualBuilder = dynamic(() => import("./VisualBuilder"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-white/50 text-center bg-slate-950 h-full flex items-center justify-center">
      Loading Visual Canvas...
    </div>
  )
});

export default VisualBuilder;
