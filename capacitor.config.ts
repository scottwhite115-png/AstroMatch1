import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.astromatch.ios',
  appName: 'AstroMatch',
  webDir: 'public',
  server: {
    url: 'https://astro-match1.vercel.app',
    cleartext: true,
    androidScheme: 'astromatch',
    iosScheme: 'astromatch',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#000000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#ff8c00",
      splashFullScreen: true,
      splashImmersive: true,
    },
    Browser: {
      // Ensure Browser plugin uses Chrome Custom Tabs on Android
      // This keeps OAuth within the app context
    },
  },
};

export default config;

