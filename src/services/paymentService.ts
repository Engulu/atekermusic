import type { PaymentInfo, PaymentResponse } from '../types';
import { z } from 'zod';

// Payment validation schema
const paymentSchema = z.object({
  provider: z.enum(['MTN', 'AIRTEL']),
  phoneNumber: z.string().regex(/^(\+256|0)[1-9]\d{8}$/, 'Invalid phone number format'),
  amount: z.number().min(100, 'Minimum amount is 100 UGX'),
  currency: z.literal('UGX'),
  reference: z.string().min(1)
});

// ============================================================================
// MTN MOBILE MONEY API INTEGRATION
// Documentation: https://momodeveloper.mtn.com/
// ============================================================================

/**
 * MTN Mobile Money API Configuration
 * 
 * Required API Credentials:
 * 1. Primary Key (Subscription Key)
 * 2. Secondary Key (Backup Subscription Key)
 * 3. User ID (API User ID)
 * 4. API Key (User API Key)
 * 
 * How to get credentials:
 * 1. Sign up at https://momodeveloper.mtn.com/
 * 2. Create a new app in the developer portal
 * 3. Subscribe to the Collection API product
 * 4. Generate API credentials
 */
const MTN_API_CONFIG = import.meta.env.MODE === 'development' ? {
  baseUrl: 'https://api.mtn.com/collection/v1',
  primaryKey: import.meta.env.VITE_MTN_PRIMARY_KEY,
  secondaryKey: import.meta.env.VITE_MTN_SECONDARY_KEY,
  userId: import.meta.env.VITE_MTN_USER_ID,
  apiKey: import.meta.env.VITE_MTN_API_KEY
} : null;

/**
 * Initiates an MTN Mobile Money payment
 * 
 * API Integration Steps:
 * 1. Create API User (if not exists)
 * 2. Create Access Token
 * 3. Request Payment
 * 4. Check Payment Status
 */
const initiateMTNPayment = async (paymentInfo: PaymentInfo): Promise<PaymentResponse> => {
  // ==========================================================================
  // STEP 1: CREATE API USER (if not exists)
  // ==========================================================================
  // POST https://api.mtn.com/v1/apiuser
  // Headers:
  // - Ocp-Apim-Subscription-Key: {primaryKey}
  // - X-Reference-Id: {userId}
  // Body: { providerCallbackHost: "https://your-callback-url.com" }

  // ==========================================================================
  // STEP 2: CREATE ACCESS TOKEN
  // ==========================================================================
  // POST https://api.mtn.com/collection/token/
  // Headers:
  // - Ocp-Apim-Subscription-Key: {primaryKey}
  // - X-Reference-Id: {userId}
  // - Authorization: Basic {base64(userId:apiKey)}

  // ==========================================================================
  // STEP 3: REQUEST PAYMENT
  // ==========================================================================
  // POST https://api.mtn.com/collection/v1/requesttopay
  // Headers:
  // - Authorization: Bearer {accessToken}
  // - X-Reference-Id: {paymentInfo.reference}
  // - X-Target-Environment: production
  // Body: {
  //   amount: paymentInfo.amount,
  //   currency: paymentInfo.currency,
  //   externalId: paymentInfo.reference,
  //   payer: {
  //     partyIdType: "MSISDN",
  //     partyId: paymentInfo.phoneNumber
  //   },
  //   payerMessage: "Payment for song download",
  //   payeeNote: "Ateker Music payment"
  // }

  // ==========================================================================
  // STEP 4: CHECK PAYMENT STATUS
  // ==========================================================================
  // GET https://api.mtn.com/collection/v1/requesttopay/{referenceId}
  // Headers:
  // - Authorization: Bearer {accessToken}
  // - X-Target-Environment: production
  
  return simulatePaymentResponse();
};

// ============================================================================
// AIRTEL MONEY API INTEGRATION
// Documentation: https://developers.airtel.africa/
// ============================================================================

/**
 * Airtel Money API Configuration
 * 
 * Required API Credentials:
 * 1. Client ID
 * 2. Client Secret
 * 3. Public Key (for encryption)
 * 
 * How to get credentials:
 * 1. Register at https://developers.airtel.africa/
 * 2. Create a new application
 * 3. Subscribe to the Collection API
 * 4. Get your credentials from the developer portal
 */
const AIRTEL_API_CONFIG = import.meta.env.MODE === 'development' ? {
  baseUrl: 'https://openapi.airtel.africa/merchant/v1',
  clientId: import.meta.env.VITE_AIRTEL_CLIENT_ID,
  clientSecret: import.meta.env.VITE_AIRTEL_CLIENT_SECRET,
  publicKey: import.meta.env.VITE_AIRTEL_PUBLIC_KEY
} : null;

/**
 * Initiates an Airtel Money payment
 * 
 * API Integration Steps:
 * 1. Generate OAuth Token
 * 2. Create Payment
 * 3. Check Payment Status
 */
const initiateAirtelPayment = async (paymentInfo: PaymentInfo): Promise<PaymentResponse> => {
  // ==========================================================================
  // STEP 1: GENERATE OAUTH TOKEN
  // ==========================================================================
  // POST https://openapi.airtel.africa/auth/oauth2/token
  // Headers:
  // - Content-Type: application/json
  // Body: {
  //   client_id: AIRTEL_API_CONFIG.clientId,
  //   client_secret: AIRTEL_API_CONFIG.clientSecret,
  //   grant_type: "client_credentials"
  // }

  // ==========================================================================
  // STEP 2: CREATE PAYMENT
  // ==========================================================================
  // POST https://openapi.airtel.africa/merchant/v1/payments
  // Headers:
  // - Authorization: Bearer {accessToken}
  // - Content-Type: application/json
  // Body: {
  //   reference: paymentInfo.reference,
  //   subscriber: {
  //     country: "UG",
  //     currency: paymentInfo.currency,
  //     msisdn: paymentInfo.phoneNumber
  //   },
  //   transaction: {
  //     amount: paymentInfo.amount,
  //     country: "UG",
  //     currency: paymentInfo.currency,
  //     id: paymentInfo.reference
  //   }
  // }

  // ==========================================================================
  // STEP 3: CHECK PAYMENT STATUS
  // ==========================================================================
  // GET https://openapi.airtel.africa/merchant/v1/payments/{paymentInfo.reference}
  // Headers:
  // - Authorization: Bearer {accessToken}
  
  return simulatePaymentResponse();
};

// Helper function to simulate payment response during development
const simulatePaymentResponse = (): Promise<PaymentResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date();
      resolve({
        success: true,
        transactionId: `TXN${Date.now()}`,
        message: 'Payment initiated successfully',
        status: 'pending',
        amount: 2000,
        currency: 'UGX',
        paymentDate: now.toISOString()
      });
    }, 2000);
  });
}

// Main payment handler that routes to appropriate provider
export const initiatePayment = async (paymentInfo: PaymentInfo): Promise<PaymentResponse> => {
  try {
    // Validate payment info
    const validatedPayment = paymentSchema.parse(paymentInfo);

    // Ensure amount doesn't exceed maximum
    if (validatedPayment.amount > 1000000) {
      throw new Error('Maximum transaction amount is 1,000,000 UGX');
    }

    // Format phone number consistently
    const formattedPhone = validatedPayment.phoneNumber.startsWith('0') 
      ? '+256' + validatedPayment.phoneNumber.slice(1)
      : validatedPayment.phoneNumber;

    const payment = {
      ...validatedPayment,
      phoneNumber: formattedPhone
    };

    if (paymentInfo.provider === 'MTN') {
      return initiateMTNPayment(payment);
    }
    return initiateAirtelPayment(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const verifyPayment = async (transactionId: string): Promise<PaymentResponse> => {
  // This function will be called periodically to check payment status
  // Implementation will depend on the provider (MTN or Airtel)
  // See the status check endpoints in the provider-specific functions above
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId,
        message: 'Payment completed successfully',
        status: 'completed',
        amount: 2000,
        currency: 'UGX',
        paymentDate: new Date().toISOString()
      });
    }, 1500);
  });
};