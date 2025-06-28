
import { Payment, PaymentMethod, RefundRequest } from '@/types/payment';

const PAYMENTS_KEY = 'shareride_payments';
const PAYMENT_METHODS_KEY = 'shareride_payment_methods';
const REFUNDS_KEY = 'shareride_refunds';

export const savePaymentsToStorage = (payments: Payment[]): void => {
  localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
};

export const loadPaymentsFromStorage = (): Payment[] => {
  const savedPayments = localStorage.getItem(PAYMENTS_KEY);
  if (savedPayments) {
    try {
      const paymentsData = JSON.parse(savedPayments);
      return paymentsData.map((payment: any) => ({
        ...payment,
        createdAt: new Date(payment.createdAt),
        completedAt: payment.completedAt ? new Date(payment.completedAt) : undefined
      }));
    } catch (error) {
      console.error('Error parsing saved payments:', error);
      return [];
    }
  }
  return [];
};

export const savePaymentMethodsToStorage = (paymentMethods: PaymentMethod[]): void => {
  localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(paymentMethods));
};

export const loadPaymentMethodsFromStorage = (): PaymentMethod[] => {
  const savedMethods = localStorage.getItem(PAYMENT_METHODS_KEY);
  if (savedMethods) {
    try {
      return JSON.parse(savedMethods);
    } catch (error) {
      console.error('Error parsing saved payment methods:', error);
      return [];
    }
  }
  return [];
};

export const saveRefundsToStorage = (refunds: RefundRequest[]): void => {
  localStorage.setItem(REFUNDS_KEY, JSON.stringify(refunds));
};

export const loadRefundsFromStorage = (): RefundRequest[] => {
  const savedRefunds = localStorage.getItem(REFUNDS_KEY);
  if (savedRefunds) {
    try {
      const refundsData = JSON.parse(savedRefunds);
      return refundsData.map((refund: any) => ({
        ...refund,
        requestedAt: new Date(refund.requestedAt),
        processedAt: refund.processedAt ? new Date(refund.processedAt) : undefined
      }));
    } catch (error) {
      console.error('Error parsing saved refunds:', error);
      return [];
    }
  }
  return [];
};
