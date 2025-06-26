
export interface PaymentMethod {
  id: string;
  type: 'card' | 'upi' | 'wallet';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  rideId: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  stripePaymentIntentId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface RefundRequest {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedAt: Date;
  processedAt?: Date;
}

export interface PaymentConfig {
  stripePublishableKey: string;
  currency: string;
  supportedPaymentMethods: string[];
}
