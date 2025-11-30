"use client";

import { supabase } from "@/lib/supabaseClient";

export default function VerifyEmail() {
  return (
    <main className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-2">Check your email</h1>
      <p className="mb-4">We sent a verification link. Click it to continue.</p>
      <button
        className="px-4 py-2 rounded bg-black text-white"
        onClick={async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user?.email) {
            await supabase.auth.resend({ type: "signup", email: user.email });
            alert("Verification email re-sent.");
          }
        }}
      >
        Resend email
      </button>
    </main>
  );
}
