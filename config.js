// Configuration script that loads environment variables into window object
// This file will be loaded before main script.js

// Load Sentry configuration from environment variables
// In development, you can manually set these in this file
// In production, these will be replaced by actual values during build

window.SENTRY_DSN = "YOUR_DSN_HERE";
window.SENTRY_ORG = "YOUR_ORG_SLUG"; 
window.SENTRY_PROJECT = "recipebox-web";

// You can override these values for local development by uncommenting below:
// window.SENTRY_DSN = "https://your-actual-dsn@sentry.io/project-id";