import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';
import axios from 'axios';

// Initialize Firebase Admin
admin.initializeApp();

// Load environment variables
const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;

interface OCRResult {
  text: string;
  items: {name: string; price: number}[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

/**
 * Parse receipt image using Google Cloud Vision REST API
 * This function receives a base64-encoded image from the client
 * and securely processes it using the API key stored in environment variables
 */
export const processReceipt = functions.https.onCall(
  { region: 'us-central1' },
  async (request: functions.https.CallableRequest<{ imageBase64: string }>) => {
    try {
      // Verify user is authenticated
      if (!request.auth) {
        throw new functions.https.HttpsError(
          'unauthenticated',
          'User must be authenticated to process receipts'
        );
      }

      const { imageBase64 } = request.data;

      if (!imageBase64) {
        throw new functions.https.HttpsError(
          'invalid-argument',
          'imageBase64 is required'
        );
      }

      // Check if API key is configured
      if (!apiKey) {
        throw new functions.https.HttpsError(
          'internal',
          'Google Cloud Vision API key not configured'
        );
      }

      // Call Google Cloud Vision REST API
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          requests: [
            {
              image: {
                content: imageBase64,
              },
              features: [
                {
                  type: 'DOCUMENT_TEXT_DETECTION',
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        }
      );

      const text =
        response.data.responses?.[0]?.fullTextAnnotation?.text || '';

      // Parse the OCR text to extract items and totals
      const ocrResult = parseReceiptText(text);

      return ocrResult;
    } catch (error) {
      console.error('Error processing receipt:', error);
      if (error instanceof functions.https.HttpsError) {
        throw error;
      }
      throw new functions.https.HttpsError(
        'internal',
        'Failed to process receipt image'
      );
    }
  }
);

/**
 * Helper function to parse receipt text and extract structured data
 */
function parseReceiptText(text: string): OCRResult {
  const lines = text.split("\n").filter((line: string) => line.trim());

  const items: {name: string; price: number}[] = [];
  let subtotal = 0;
  let tax = 0;
  let tip = 0;

  // Very basic parsing - look for currency amounts
  lines.forEach((line: string) => {
    const priceMatch = line.match(/\$?([\d,]+\.?\d{0,2})/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1].replace(/,/g, ''));
      if (price > 0) {
        const name = line.replace(priceMatch[0], '').trim() || 'Item';
        items.push({ name, price });
      }
    }
  });

  // Extract totals (look for keywords)
  const subtotalMatch = text.match(/subtotal[:\s]+\$?([\d,]+\.?\d{2})/i);
  if (subtotalMatch) subtotal = parseFloat(subtotalMatch[1].replace(/,/g, ''));

  const taxMatch = text.match(/tax[:\s]+\$?([\d,]+\.?\d{2})/i);
  if (taxMatch) tax = parseFloat(taxMatch[1].replace(/,/g, ''));

  const tipMatch = text.match(/tip[:\s]+\$?([\d,]+\.?\d{2})/i);
  if (tipMatch) tip = parseFloat(tipMatch[1].replace(/,/g, ''));

  const totalMatch = text.match(/total[:\s]+\$?([\d,]+\.?\d{2})/i);
  const total = totalMatch
    ? parseFloat(totalMatch[1].replace(/,/g, ''))
    : subtotal + tax + tip;

  return {
    text,
    items: items.length > 0 ? items : [{ name: 'Item', price: subtotal }],
    subtotal: subtotal || total - tax - tip,
    tax,
    tip,
    total,
  };
}
