"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UploadCloud, CheckCircle2 } from "lucide-react";

export default function RAUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploaded" | "verified">("idle");
  const supabase = createClient();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // In a real app, upload to Supabase Storage
      /*
      const { error } = await supabase.storage
        .from('compliance_docs')
        .upload(`${user.id}/ra_certificate.pdf`, file);
      if (error) throw error;
      */

      // Simulate upload and admin alert creation
      await new Promise(r => setTimeout(r, 2000));
      
      await supabase.from("admin_alerts").insert({
        user_id: user.id,
        alert_type: "ra_verification_request",
        message: "User uploaded RA Certificate for review",
      });

      setStatus("uploaded");
    } catch (error) {
      alert("Failed to upload document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 w-full max-w-lg">
      <h2 className="text-xl font-bold text-white mb-2">SEBI RA Verification</h2>
      <p className="text-sm text-white/60 mb-6">
        Required for publishing Black Box (Proprietary / AI) strategies to the marketplace.
      </p>

      {status === "verified" && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg flex items-center">
          <CheckCircle2 className="w-5 h-5 mr-2" />
          <div>
            <p className="font-bold">RA License Verified</p>
            <p className="text-xs mt-1">You are authorized to publish Black Box strategies.</p>
          </div>
        </div>
      )}

      {status === "uploaded" && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 p-4 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold">Under Review</p>
            <p className="text-xs mt-1">Our compliance team will review your document within 48 hours.</p>
          </div>
        </div>
      )}

      {status === "idle" && (
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:bg-white/5 transition-colors">
            <input 
              type="file" 
              accept=".pdf" 
              id="file-upload" 
              className="hidden" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-12 h-12 text-primary mb-3" />
              <p className="text-white font-medium mb-1">
                {file ? file.name : "Click to upload SEBI RA Certificate"}
              </p>
              <p className="text-white/50 text-xs">PDF format only. Max 5MB.</p>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !file}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Submit for Verification"}
          </button>
        </form>
      )}
    </div>
  );
}
