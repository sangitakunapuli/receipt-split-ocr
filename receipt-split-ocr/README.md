# Receipt Split OCR App

A React Native app that uses Google Cloud Vision API to read receipts, split items among group members, and calculate who owes whom.

## Features

- 📸 **Receipt Scanning**: Capture or upload receipt images
- 🤖 **OCR Processing**: Uses Google Cloud Vision API to extract text from receipts
- 💰 **Item Management**: Edit extracted items and prices
- 👥 **Group Management**: Add group members and assign items to them
- 🧮 **Settlement Calculation**: Automatically calculates who owes whom including tax and tip distribution
- 🔒 **Secure Backend**: Uses Firebase Cloud Functions to securely handle API keys

## Architecture

```
receipt-split-ocr/
├── app/                    # Expo Router screens
├── services/
│   ├── ocrService.ts      # OCR processing logic
│   └── firebaseService.ts # Firebase integration
├── contexts/              # React Context for state management
├── types/                 # TypeScript types
├── functions/             # Firebase Cloud Functions (backend)
│   ├── src/
│   │   └── index.ts      # Cloud Function for OCR processing
│   └── package.json
└── firebase.json         # Firebase configuration
```

## Prerequisites

- Node.js 20 or higher
- Firebase account and project
- Google Cloud Vision API enabled

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase

Follow the detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md):

```bash
firebase init functions
```

Then deploy your Cloud Functions:

```bash
firebase deploy --only functions
```

### 3. Configure Firebase Credentials

Copy `.env.example` to `.env.local` and add your Firebase configuration:

```bash
cp .env.example .env.local
```

Then update `.env.local` with your Firebase project credentials.

### 4. Start the App

```bash
npm start
```

## How It Works

1. **User captures/uploads receipt** → Image converted to base64
2. **Send to Firebase Cloud Function** → Function receives authenticated request
3. **Cloud Function calls Google Vision API** → Uses securely stored API key
4. **OCR results returned to app** → Items, prices, tax, and tip extracted
5. **User assigns items to members** → Select which items each person had
6. **Settlement calculated** → Tax and tip distributed fairly among members

## OCR Processing

The app uses Google Cloud Vision's DOCUMENT_TEXT_DETECTION feature for high-accuracy text extraction from receipt images.

### How Receipt Parsing Works

The Cloud Function extracts text and uses pattern matching to identify:
- **Items**: Lines with price amounts
- **Subtotal**: Matches "subtotal: $X.XX"
- **Tax**: Matches "tax: $X.XX"
- **Tip**: Matches "tip: $X.XX"
- **Total**: Matches "total: $X.XX"

### Improving Accuracy

For better results with different receipt formats, you can enhance the parsing logic in:
- `functions/src/index.ts` - Server-side parsing
- `services/ocrService.ts` - Client-side formatting

## Firebase Cloud Functions

### Deployed Function: `processReceipt`

**Endpoint**: `processReceipt` (called via Firebase SDK)

**Request**:
```typescript
{
  imageBase64: string  // Base64-encoded receipt image
}
```

**Response**:
```typescript
{
  text: string                        // Full OCR text
  items: Array<{name: string, price: number}>  // Extracted items
  subtotal: number                    // Subtotal amount
  tax: number                         // Tax amount
  tip: number                         // Tip amount
  total: number                       // Total amount
}
```

**Security**: Only authenticated users (anonymous auth) can call this function.

## File Structure

```
app/
├── (tabs)/
│   └── index.tsx           # Home screen with overview
├── upload-receipt.tsx      # Step 1: Upload & group setup
├── edit-receipt.tsx        # Step 2: Edit items & totals
├── assign-items.tsx        # Step 3: Assign to members
├── settlement.tsx          # Step 4: View settlement
└── _layout.tsx            # Root layout with providers

services/
├── ocrService.ts          # OCR processing functions
└── firebaseService.ts     # Firebase setup & API calls

contexts/
└── ReceiptContext.tsx     # Global state management

types/
└── index.ts              # TypeScript interfaces
```

## Troubleshooting

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase troubleshooting.

### Common Issues

**"Failed to process receipt"**
- Check Firebase logs: `firebase functions:log`
- Verify Vision API is enabled in Google Cloud Console
- Check receipt image quality

**"User must be authenticated"**
- Ensure Firebase config is correct
- Check `.env.local` has all required Firebase credentials

**"Timeout Error"**
- First invocation may take 1-2 seconds (cold start)
- Check function logs for errors
- Ensure Vision API is enabled

## API Key Security

🔒 **Your Google Cloud Vision API key is never exposed to the client app:**

- Stored securely on Firebase servers
- Only used by Cloud Functions
- Not included in any client-side code
- Requests are authenticated with Firebase tokens

## Performance

- **Cold Start**: 1-2 seconds on first invocation
- **Warm Start**: 100-500ms on subsequent invocations
- **OCR Processing**: 1-3 seconds depending on receipt complexity
- **Total Time**: 2-5 seconds per receipt

## Cost Estimation

- **Vision API**: ~$0.60 per 1000 receipts processed
- **Cloud Functions**: Free tier includes 2 million invocations/month
- **Firebase Auth**: Free for anonymous auth

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [React Context API](https://react.dev/reference/react/useContext)

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT


```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
