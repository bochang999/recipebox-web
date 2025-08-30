import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bochang.recipebox',
  appName: 'RecipeBox',
  webDir: '.',
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#2196F3',
      overlaysWebView: false
    }
  },
  android: {
    allowMixedContent: true
  }
};

export default config;