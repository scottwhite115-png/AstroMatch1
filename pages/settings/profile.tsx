import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LocationConsent from '@/components/LocationConsent';
import ProfileLocationField from '@/components/ProfileLocationField';
import { loadCachedLocation, LocationRecord, saveCachedLocation } from '@/lib/location';
import { supabase } from '@/lib/supabaseClient';

export default function EditProfilePage() {
  const [location, setLocation] = useState<string>('');
  const [structLoc, setStructLoc] = useState<LocationRecord | null>(null);
  const [needsConsent, setNeedsConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Decide if we should ask for consent
    const cached = loadCachedLocation();
    setNeedsConsent(!cached);
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const { data: { user }, error: uerr } = await supabase.auth.getUser();
      if (uerr || !user) throw uerr || new Error('No user');

      // If the user typed a custom location, update cached formatted only (keep lat/lon if we have them)
      if (structLoc) {
        const updated = { ...structLoc, formatted: location, timestamp: Date.now() };
        saveCachedLocation(updated);
      }

      const payload: any = {
        location_formatted: location || structLoc?.formatted || null,
        location_city: structLoc?.city ?? null,
        location_region: structLoc?.region ?? null,
        location_country: structLoc?.country ?? null,
        location_lat: structLoc?.lat ?? null,
        location_lon: structLoc?.lon ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
      if (error) throw error;

      router.push('/profile'); // or wherever
    } catch (e) {
      alert((e as any)?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-xl font-semibold">Edit Profile</h1>

      {needsConsent && (
        <LocationConsent
          onLocationReady={(loc) => {
            setStructLoc(loc);
            setLocation(loc.formatted);
            setNeedsConsent(false);
          }}
        />
      )}

      <ProfileLocationField
        value={location}
        onChange={setLocation}
        onStructured={(loc) => setStructLoc(loc)}
      />

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 rounded-md border"
      >
        {saving ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}


