import axios from 'axios';
import * as FileSystem from 'expo-file-system/legacy';

export interface OCRResult {
  text: string;
  items: Array<{ name: string; price: number }>;
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
}

// Mock OCR function - in production, use Google Cloud Vision, AWS Textract, or similar
export const parseReceiptImage = async (imageUri: string): Promise<OCRResult> => {
  try {
    // For demo purposes, return a sample result
    // In production, you would send the image to an OCR API
    const mockResult: OCRResult = {
      text: 'Sample receipt text',
      items: [
        { name: 'Burger', price: 12.99 },
        { name: 'Fries', price: 5.99 },
        { name: 'Drink', price: 3.99 },
      ],
      subtotal: 22.97,
      tax: 2.07,
      tip: 0,
      total: 25.04,
    };

    return mockResult;
  } catch (error) {
    console.error('Error parsing receipt:', error);
    throw new Error('Failed to parse receipt image');
  }
};

// Helper function to convert image to base64 for API calls
export const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

// Real OCR implementation using Google Cloud Vision REST API
// API key is stored in .env.local
export const parseReceiptWithGoogleVision = async (
  imageUri: string,
  apiKey?: string,
): Promise<OCRResult> => {
  try {
    // Use provided API key or get from environment
    const key = apiKey || process.env.EXPO_PUBLIC_GOOGLE_VISION_API_KEY;
    
    if (!key) {
      console.warn('No API key provided, using mock data');
      return parseReceiptImage(imageUri);
    }

    const base64Image = await imageToBase64(imageUri);

    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${key}`,
      {
        requests: [
          {
            image: {
              content: base64Image,
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
          'Content-Type': 'application/json; charset=utf-8',
        },
        timeout: 30000,
      }
    );

    const text =
      response.data.responses?.[0]?.fullTextAnnotation?.text || '';

    console.log('OCR Full Text:', text);
    // Parse the text to extract items and totals
    const lines = text.split('\n').filter((line: string) => line.trim());

    const items: Array<{ name: string; price: number }> = [];


    // for (let i = 0; i < lines.length; i++) {
    //     const line = lines[i];
    //     const priceMatch = line.match(/\$?([\d,]+\.\d{0,2})/);
    //     if (priceMatch) {
    //         const price = parseFloat(priceMatch[1].replace(/,/g, ''));
    //         if (price > 0) {
    //             const name = lines[i-1] ? lines[i-1].trim() : 'Item';
    //             // const name = lines[i-1].replace(lines[i-1], '').trim() || 'Item';
    //             items.push({ name, price });
    //         }
    //   }
    // }


    let subtotal = 0;
    let tax = 0;
    let tip = 0;

    // Parse items - handle both same-line and separate-line price formats
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const priceMatch = line.match(/\$?([\d,]+\.\d{0,2})/);

      if (priceMatch) {
        // Price is on the same line as item name
        const price = parseFloat(priceMatch[1].replace(/,/g, ''));
        if (price > 0) {
          const name = line.replace(priceMatch[0], '').trim() || 'Item';
          items.push({ name, price });
        }
        i++;
      } else if (i + 1 < lines.length) {
        // Check if next line has a price (price on separate line)
        const nextLine = lines[i + 1];
        const nextPriceMatch = nextLine.match(/^\$?([\d,]+\.\d{0,2})$/);

        if (nextPriceMatch) {
          // Next line is just a price
          const price = parseFloat(nextPriceMatch[1].replace(/,/g, ''));
          if (price > 0) {
            const name = line.trim() || 'Item';
            items.push({ name, price });
            i += 2; // Skip both the name line and price line
          } else {
            i++;
          }
        } else {
          i++;
        }
      } else {
        i++;
      }
    }

    console.log('OCR Text:', items);

    // Extract totals (simplified - look for keywords)
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
  } catch (error) {
    console.error('Error with Google Cloud Vision API:', error);
    // Fallback to mock result
    return parseReceiptImage(imageUri);
  }
};

