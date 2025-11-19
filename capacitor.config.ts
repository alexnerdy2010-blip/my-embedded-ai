import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.refai.app',
  appName: 'RefAI',
  webDir: 'dist',
  server: {
    url: 'https://1afa3155-0c3e-4aa1-9dd0-fbcdfb4b64c8.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;
