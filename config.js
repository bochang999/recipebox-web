// Configuration script that loads environment variables into window object
// This file will be loaded before main script.js

// Load Sentry configuration from environment variables
// In development, you can manually set these in this file
// In production, these will be replaced by actual values during build

window.SENTRY_DSN = "https://f33ed55dd2721d876d01b9f2fd39d4ac@o4509917034840064.ingest.us.sentry.io/4509917059284992";
window.SENTRY_ORG = "bochangs-labo"; 
window.SENTRY_PROJECT = "recipebox-web";

// You can override these values for local development by uncommenting below:
// window.SENTRY_DSN = "https://your-actual-dsn@sentry.io/project-id";