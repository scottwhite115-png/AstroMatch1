import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requireEmailVerified, requireMatchReady, requireOnboardingComplete } from "@/lib/guards";

export function useRequireEmailVerified() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const g = await requireEmailVerified();
      if (!g.allowed) router.replace("/auth/verify-email");
      else setChecking(false);
    })();
  }, [router]);

  return checking;
}

export function useRequireOnboarding() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const g = await requireOnboardingComplete();
      if (!g.allowed) router.replace("/profile-builder");
      else setChecking(false);
    })();
  }, [router]);

  return checking;
}

export function useRequireMatchReady() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const g = await requireMatchReady();
      if (!g.allowed) {
        if (g.reason === "email_unverified") router.replace("/auth/verify-email");
        else if (g.reason === "onboarding_required") router.replace("/profile-builder");
        else if (g.reason === "location_required") router.replace("/auth/enable-location");
        else if (g.reason === "zodiac_required") router.replace("/profile-builder");
        else router.replace("/login");
      } else {
        setChecking(false);
      }
    })();
  }, [router]);

  return checking;
}
