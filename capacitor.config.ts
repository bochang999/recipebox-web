import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.pwatemplate',
  appName: 'PWA Template',
  webDir: './',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true,
    loggingBehavior: 'debug',
    useLegacyBridge: false,
    appendUserAgent: 'PWATemplate/1.0',
    overrideUserAgent: null,
    backgroundColor: '#FFFFFF',
    toolbarColor: '#2C3E50',
    navigationBarColor: '#2C3E50',
    hideNavigationBar: false,
    preferredStatusBarStyle: 'dark',
    allowedNavigation: [
      'https://*',
      'http://localhost:*',
      'http://127.0.0.1:*'
    ]
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    preferredStatusBarStyle: 'dark'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#2C3E50',
      splashFullScreen: true,
      splashImmersive: true,
      backgroundColor: '#FFFFFF'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#2C3E50',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'body',
      style: 'dark',
      resizeOnFullScreen: true
    },
    App: {
      statusBarStyle: 'dark'
    },
    Device: {},
    Storage: {},
    Filesystem: {},
    Network: {},
    Toast: {},
    Haptics: {},
    LocalNotifications: {
      smallIcon: 'ic_stat_notification',
      iconColor: '#2C3E50',
      sound: null
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  },
  cordova: {},
  includePlugins: [
    '@capacitor/app',
    '@capacitor/haptics',
    '@capacitor/keyboard',
    '@capacitor/status-bar',
    '@capacitor/splash-screen',
    '@capacitor/storage',
    '@capacitor/filesystem',
    '@capacitor/device',
    '@capacitor/network',
    '@capacitor/toast',
    '@capacitor/local-notifications',
    '@capacitor/push-notifications'
  ]
};

export default config;