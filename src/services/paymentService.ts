
import { Payment, PaymentMethod, RefundRequest } from '@/types/payment';

export const createPayment = (
  bookingId: string, 
  amount: number, 
  paymentMethod: PaymentMethod
): Payment => {
  return {
    id: Date.now().toString(),
    rideId: bookingId, // This would be derived from booking in real implementation
    bookingId: bookingId,
    amount: amount,
    currency: 'USD',
    status: 'processing',
    paymentMethod: paymentMethod,
    stripePaymentIntentId: `pi_${Date.now()}`,
    createdAt: new Date()
  };
};

export const simulatePaymentProcessing = (
  payment: Payment,
  onComplete: (completedPayment: Payment) => void
): void => {
  // Simulate processing delay
  setTimeout(() => {
    const completedPayment = { 
      ...payment, 
      status: 'completed' as const, 
      completedAt: new Date() 
    };
    onComplete(completedPayment);
  }, 2000);
};

export const createPaymentMethod = (
  paymentMethodData: Omit<PaymentMethod, 'id'>
): PaymentMethod => {
  return {
    ...paymentMethodData,
    id: Date.now().toString()
  };
};

export const updatePaymentMethodDefault = (
  paymentMethods: PaymentMethod[],
  paymentMethodId: string
): PaymentMethod[] => {
  return paymentMethods.map(pm => ({
    ...pm,
    isDefault: pm.id === paymentMethodId
  }));
};

export const filterUserPayments = (payments: Payment[]): Payment[] => {
  return payments.filter(payment => payment.status === 'completed');
};

export const createRefundRequest = (
  paymentId: string,
  payment: Payment,
  reason: string
): RefundRequest => {
  return {
    id: Date.now().toString(),
    paymentId: paymentId,
    amount: payment.amount,
    reason: reason,
    status: 'pending',
    requestedAt: new Date()
  };
};
