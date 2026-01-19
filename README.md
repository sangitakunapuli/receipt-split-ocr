# Receipt Split OCR App

A React Native app built with Expo that allows users to split receipts easily using OCR technology.

## Features

### Step 1: Create Group
- Add group members who will split the receipt
- Add as many people as needed

### Step 2: Upload & Scan Receipt
- Capture a photo of the receipt using the camera or upload from gallery
- OCR automatically reads and transcribes the receipt items and amounts
- Edit receipt items, amounts, tax, and tip before proceeding

### Step 3: Assign Items
- View all receipt items
- Assign each item to group members who ordered it
- Items can be split among multiple people
- See per-person breakdown for each item

### Step 4: View Settlement
- See the total amount each person owes
- Tax and tip are distributed proportionally based on items assigned
- Clear summary showing who owes who and how much

## Project Structure

```
app/
├── (tabs)/
│   └── index.tsx              # Home screen with app overview
├── upload-receipt.tsx          # Step 1: Group creation & image upload
├── edit-receipt.tsx            # Step 2: Edit receipt items and totals
├── assign-items.tsx            # Step 3: Assign items to group members
├── settlement.tsx              # Step 4: View settlements
└── _layout.tsx                 # App layout with ReceiptProvider

contexts/
└── ReceiptContext.tsx          # Global state management for receipt data

services/
└── ocrService.ts               # OCR processing and image handling

types/
└── index.ts                    # TypeScript interfaces and types
```

## Setup & Installation

### Prerequisites
- Node.js and npm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Xcode) or Android Emulator

### Installation Steps

1. **Install dependencies:**
   ```bash
   cd receipt-split-ocr
   npm install
   ```

2. **Install additional required packages:**
   ```bash
   npm install expo-image-picker axios
   ```

3. **Run the app:**
   ```bash
   npm run ios      # For iOS Simulator
   npm run android  # For Android Emulator
   npm run web      # For web browser
   ```

## Data Types

### GroupMember
```typescript
interface GroupMember {
  id: string;
  name: string;
}
```

### ReceiptItem
```typescript
interface ReceiptItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // array of member IDs
}
```

### Receipt
```typescript
interface Receipt {
  id: string;
  imageUri: string;
  items: ReceiptItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  createdAt: Date;
}
```

### Settlement
```typescript
interface Settlement {
  from: string;    // member ID who owes
  to: string;      // member ID who is owed
  amount: number;
}
```

## Context API (ReceiptContext)

The app uses React Context for global state management:

```typescript
const context = useReceiptContext();
// Available methods:
- addGroupMember(name: string)
- removeGroupMember(id: string)
- setReceipt(receipt: Receipt)
- updateReceiptItems(items: ReceiptItem[])
- updateReceiptTotals(subtotal, tax, tip)
- calculateSettlements() => Settlement[]
```

## OCR Processing

The app currently uses a mock OCR function in `services/ocrService.ts`. To integrate with a real OCR service:

1. **Google Cloud Vision API** (recommended):
   - Set up a Google Cloud project
   - Enable Cloud Vision API
   - Use `parseReceiptWithGoogleVision()` function
   - Pass your API key

2. **Alternative OCR Services:**
   - AWS Textract
   - Microsoft Azure Computer Vision
   - AWS Rekognition

Example integration with Google Vision:
```typescript
const apiKey = 'YOUR_GOOGLE_API_KEY';
const result = await parseReceiptWithGoogleVision(imageUri, apiKey);
```

## Settlement Calculation Algorithm

1. **Item Distribution**: Each item's price is divided equally among assigned members
2. **Tax Distribution**: Tax is distributed proportionally based on each member's item total
3. **Tip Distribution**: Tip is distributed proportionally based on each member's item total
4. **Settlement**: The first group member is assumed to be the payer; others owe them

Formula:
```
PersonAmount = (ItemsPrice + ProportionalTax + ProportionalTip) / NumAssignedPeople
```

## Usage Example

1. **Home Screen**: Tap "Start New Receipt"
2. **Step 1**: Add group members (e.g., "Alice", "Bob", "Charlie")
3. **Step 2**: Take/upload receipt photo, edit items and amounts
4. **Step 3**: Assign items to members
5. **Step 4**: View settlement showing who owes what

## Dependencies

- **expo**: React Native framework
- **expo-router**: File-based routing
- **expo-image-picker**: Camera and gallery access
- **axios**: HTTP requests for OCR API
- **react-native-reanimated**: Animations
- **@react-navigation**: Navigation library

## Future Enhancements

- [ ] Real OCR integration with Google Vision API
- [ ] Receipt history and saved receipts
- [ ] Payment tracking and history
- [ ] Multiple payers support
- [ ] Expense categories
- [ ] Receipt sharing via QR code
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Receipt image storage

## Testing

To test the app:

1. Run on simulator or device
2. Add 2-3 group members
3. Select an image (any image works for demo)
4. Edit receipt items as needed
5. Assign items to group members
6. View settlement calculation

## Troubleshooting

**Image picker not working:**
- Ensure permissions are granted (Camera, Photo Library)
- Check Info.plist (iOS) or AndroidManifest.xml (Android) for permissions

**OCR not processing:**
- Check internet connection
- Verify API key if using Google Vision
- Check image quality and orientation

**Navigation issues:**
- Clear Expo cache: `expo start --clear`
- Restart development server

## License

MIT

## Author

Created as a receipt splitting utility with OCR capabilities for shared expenses.
