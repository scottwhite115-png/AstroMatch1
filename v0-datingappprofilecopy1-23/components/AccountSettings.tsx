'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { getAuthProvider } from '@/lib/getAuthProvider';
import { Mail, Apple, Facebook, Chrome } from 'lucide-react';

export default function AccountSettings() {
  const [info, setInfo] = useState<{ provider: string; email: string | null } | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getAuthProvider();
      if (!data) return;
      setInfo({ provider: data.provider, email: data.email });

      await supabase
        .from('profiles')
        .update({ auth_provider: data.provider, email: data.email })
        .eq('id', data.id);
    })();
  }, []);

  const renderProvider = () => {
    switch (info?.provider) {
      case 'google':
        return <div className="flex items-center gap-2"><Chrome className="w-4 h-4" /> Google</div>;
      case 'apple':
        return <div className="flex items-center gap-2"><Apple className="w-4 h-4" /> Apple</div>;
      case 'facebook':
        return <div className="flex items-center gap-2"><Facebook className="w-4 h-4" /> Facebook</div>;
      default:
        return <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> Email Login</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Account</h1>

      <div className="border rounded-md p-3 bg-white/70 backdrop-blur">
        <p className="text-sm text-gray-500 mb-1">Signed in with:</p>
        <div className="font-medium">{renderProvider()}</div>
        {info?.email && (
          <p className="text-sm text-gray-600 mt-1">{info.email}</p>
        )}
      </div>
    </div>
  );
}


