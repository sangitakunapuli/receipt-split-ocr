# Firebase Cloud Functions Setup Guide

This guide will help you set up Firebase Cloud Functions to securely handle OCR processing with the Google Cloud Vision API.

## Why Use Cloud Functions?

- **Security**: Your Google Cloud Vision API key is stored securely on Firebase servers, never exposed to the client
- **Cost Efficient**: Cloud Functions scale automatically and you only pay for what you use
- **Easy Authentication**: Firebase handles user authentication automatically
- **Performance**: API calls are processed server-side for better performance

## Prerequisites

1. [Node.js](https://nodejs.org/) (version 20 or higher)
2. [Firebase CLI](https://firebase.google.com/docs/cli) installed globally
3. A [Google Cloud Project](https://console.cloud.google.com/)
4. A [Firebase Project](https://console.firebase.google.com/)

## Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

## Step 2: Authenticate with Firebase

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

## Step 3: Create a Firebase Project

If you haven't already:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Note your **Project ID** (you'll need this later)

## Step 4: Initialize Firebase in Your Project

```bash
firebase init functions
```

When prompted:
- Select your Firebase project
- Choose TypeScript
- Say "Yes" to ESLint
- Say "Yes" to install dependencies

The setup has already configured your functions, so you can skip the additional setup prompts.

## Step 5: Set Up Google Cloud Vision API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (must be the same as your Firebase project)
3. Search for "Vision API" in the search bar
4. Click on "Vision API"
5. Click "Enable" button
6. The Cloud Functions will use Application Default Credentials, so no additional setup is needed

## Step 6: Configure Environment Variables

The Cloud Function uses Application Default Credentials (ADC) which are automatically available in Firebase Cloud Functions environment.

To run functions locally, set up your local credentials:

```bash
gcloud auth application-default login
```

## Step 7: Add Firebase Config to React App

1. Copy your Firebase config from Firebase Console:
   - Go to Project Settings
   - Scroll to "Your apps"
   - Click on your app to see the config

2. Create or update `.env.local` in your project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

3. Update `services/firebaseService.ts` with your Firebase config if needed

## Step 8: Deploy Cloud Functions

Deploy to Firebase:

```bash
firebase deploy --only functions
```

This will:
1. Build TypeScript to JavaScript
2. Package the functions
3. Deploy to Firebase Cloud Functions
4. Show you the deployed function URLs

## Step 9: Test the Integration

1. Start your React Native app:

```bash
npm start
```

2. Test the OCR functionality:
   - Upload an image of a receipt
   - The app will send it to your Cloud Function
   - The function will process it with Google Cloud Vision API
   - Results will be returned to your app

## Testing Cloud Functions Locally

To test your functions locally before deploying:

```bash
cd functions
npm run serve
```

This starts the emulator and you can test your functions locally.

## Monitoring and Debugging

View logs of your deployed functions:

```bash
firebase functions:log
```

Or in the [Firebase Console](https://console.firebase.google.com/):
1. Go to Build → Functions
2. Click on your function name
3. Select the "Logs" tab

## Troubleshooting

### "Authentication Error"
- Make sure you've enabled the Vision API in Google Cloud Console
- Verify your Firebase project ID is correct
- Check that your firebaseService.ts has the correct Firebase config

### "Function not found"
- Make sure you've deployed: `firebase deploy --only functions`
- Check that the function is deployed in Firebase Console

### "CORS or Network Errors"
- Check your browser's console for detailed error messages
- Verify your Firebase config is correct in `.env.local`

### "Timeout Errors"
- The first invocation might take 1-2 seconds (cold start)
- Check function logs for errors

## Security Best Practices

✅ Your Google Cloud Vision API key is secure on Firebase
✅ Only authenticated users can call the function (currently anonymous auth)
✅ API calls are made server-side, not exposed to the client
✅ All data is encrypted in transit

## Next Steps

1. Add rate limiting to prevent abuse
2. Implement user authentication (currently uses anonymous auth)
3. Add receipt image storage to Cloud Storage
4. Implement more sophisticated text parsing
5. Add OCR result caching to reduce API calls

## Cost Estimation

- **Vision API**: $0.60 per 1000 TEXT_DETECTION requests
- **Cloud Functions**: Free tier includes 2 million function invocations/month
- **Firebase Authentication**: Free for anonymous auth

For detailed pricing, see [Google Cloud Vision Pricing](https://cloud.google.com/vision/pricing) and [Firebase Pricing](https://firebase.google.com/pricing).
