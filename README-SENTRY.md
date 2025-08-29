# Sentry Setup Guide for RecipeBox

## 🔧 Setup Instructions

### 1. Create Sentry Project
1. Go to https://sentry.io/
2. Sign up or log in
3. Create new project → JavaScript → Name: "recipebox-web"
4. Copy the DSN key (looks like: `https://abc123@sentry.io/project-id`)

### 2. Configure Local Environment
Edit `config.js` and replace placeholder values:
```javascript
window.SENTRY_DSN = "https://your-actual-dsn@sentry.io/project-id";
```

For CLI operations, edit `.sentryclirc`:
```ini
org=your-actual-org-slug
token=your-actual-auth-token
```

### 3. Test Setup
1. Open the app in browser
2. Check browser console for Sentry initialization
3. Force an error to test reporting

### 4. Production Deployment
For GitHub Actions, add these secrets:
- `SENTRY_DSN`
- `SENTRY_AUTH_TOKEN` 
- `SENTRY_ORG`

## 🔒 Security Notes
- Never commit real keys to Git
- `.env` and `.sentryclirc` are gitignored
- Use GitHub Secrets for CI/CD
- Use `config.js` for local development overrides

## 📊 Usage
The app automatically reports errors to Sentry. Use the built-in `handleError()` method:
```javascript
app.handleError(new Error("Test error"), "component-name");
```