"use client";

import { useState } from "react";
import EmailSignUp from "./EmailSignUp";
import MobileSignUp from "./MobileSignUp";
import OAuthButtons from "./OAuthButtons";

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [method, setMethod] = useState<"email" | "mobile">("email");

  return (
    <div className="space-y-6">
      <div className="flex justify-center p-1 bg-white/5 rounded-lg border border-white/10">
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            mode === "signin" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-white"
          }`}
          onClick={() => setMode("signin")}
        >
          Sign In
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            mode === "signup" ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-white"
          }`}
          onClick={() => setMode("signup")}
        >
          Sign Up
        </button>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setMethod("email")}
          className={`text-sm font-medium transition-colors ${
            method === "email" ? "text-white border-b-2 border-primary" : "text-muted-foreground"
          }`}
        >
          Email
        </button>
        <button
          onClick={() => setMethod("mobile")}
          className={`text-sm font-medium transition-colors ${
            method === "mobile" ? "text-white border-b-2 border-primary" : "text-muted-foreground"
          }`}
        >
          Mobile
        </button>
      </div>

      <div className="min-h-[280px]">
        {method === "email" ? (
          <EmailSignUp mode={mode} />
        ) : (
          <MobileSignUp mode={mode} />
        )}
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <OAuthButtons />
    </div>
  );
}
