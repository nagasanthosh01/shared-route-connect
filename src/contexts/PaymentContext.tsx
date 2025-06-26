
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Payment, PaymentMethod, RefundRequest } from '@/types/payment';
import { useAuth } from './AuthContext';

interface PaymentContextType {
  payments: Payment[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  processPayment: (bookingId: string, amount: number, paymentMethodId: string) => Promise<Payment>;
  addPaymentMethod: (paymentMethod: Omit<PaymentMethod, 'id'>) => Promise<void>;
  removePaymentMethod: (paymentMethodId: string) => Promise<void>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<void>;
  getPaymentHistory: (userId: string) => Payment[];
  requestRefund: (paymentId: string, reason: string) => Promise<void>;
  getRefundStatus: (paymentId: string) => RefundRequest | undefined;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load payment data from localStorage on mount
  useEffect(() => {
    const savedPayments = localStorage.getItem('shareride_payments');
    const savedPaymentMethods = localStorage.getItem('shareride_payment_methods');
    const savedRefunds = localStorage.getItem('shareride_refunds');
    
    if (savedPayments) {
      try {
        const paymentsData = JSON.parse(savedPayments);
        const parsedPayments = paymentsData.map((payment: any) => ({
          ...payment,
          createdAt: new Date(payment.createdAt),
          completedAt: payment.completedAt ? new Date(payment.completedAt) : undefined
        }));
        setPayments(parsedPayments);
      } catch (error) {
        console.error('Error parsing saved payments:', error);
      }
    }

    if (savedPaymentMethods) {
      try {
        setPaymentMethods(JSON.parse(savedPaymentMethods));
      } catch (error) {
        console.error('Error parsing saved payment methods:', error);
      }
    }

    if (savedRefunds) {
      try {
        const refundsData = JSON.parse(savedRefunds);
        const parsedRefunds = refundsData.map((refund: any) => ({
          ...refund,
          requestedAt: new Date(refund.requestedAt),
          processedAt: refund.processedAt ? new Date(refund.processedAt) : undefined
        }));
        setRefundRequests(parsedRefunds);
      } catch (error) {
        console.error('Error parsing saved refunds:', error);
      }
    }
  }, []);

  const processPayment = async (bookingId: string, amount: number, paymentMethodId: string): Promise<Payment> => {
    if (!user) throw new Error('User must be logged in to process payment');
    
    setIsLoading(true);
    try {
      const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
      if (!paymentMethod) throw new Error('Payment method not found');

      // Simulate payment processing (in real implementation, this would call Stripe API)
      const newPayment: Payment = {
        id: Date.now().toString(),
        rideId: bookingId, // This would be derived from booking
        bookingId: bookingId,
        amount: amount,
        currency: 'USD',
        status: 'processing',
        paymentMethod: paymentMethod,
        stripePaymentIntentId: `pi_${Date.now()}`,
        createdAt: new Date()
      };

      // Simulate processing delay
      setTimeout(() => {
        const updatedPayment = { ...newPayment, status: 'completed' as const, completedAt: new Date() };
        const updatedPayments = payments.map(p => p.id === newPayment.id ? updatedPayment : p);
        if (!updatedPayments.find(p => p.id === newPayment.id)) {
          updatedPayments.push(updatedPayment);
        }
        setPayments(updatedPayments);
        localStorage.setItem('shareride_payments', JSON.stringify(updatedPayments));
      }, 2000);

      const updatedPayments = [...payments, newPayment];
      setPayments(updatedPayments);
      localStorage.setItem('shareride_payments', JSON.stringify(updatedPayments));

      return newPayment;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (paymentMethod: Omit<PaymentMethod, 'id'>): Promise<void> => {
    if (!user) throw new Error('User must be logged in to add payment method');
    
    setIsLoading(true);
    try {
      const newPaymentMethod: PaymentMethod = {
        ...paymentMethod,
        id: Date.now().toString()
      };

      const updatedMethods = [...paymentMethods, newPaymentMethod];
      setPaymentMethods(updatedMethods);
      localStorage.setItem('shareride_payment_methods', JSON.stringify(updatedMethods));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removePaymentMethod = async (paymentMethodId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedMethods = paymentMethods.filter(pm => pm.id !== paymentMethodId);
      setPaymentMethods(updatedMethods);
      localStorage.setItem('shareride_payment_methods', JSON.stringify(updatedMethods));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedMethods = paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      }));
      setPaymentMethods(updatedMethods);
      localStorage.setItem('shareride_payment_methods', JSON.stringify(updatedMethods));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentHistory = (userId: string): Payment[] => {
    return payments.filter(payment => 
      // This would need to be filtered by user ID in a real implementation
      payment.status === 'completed'
    );
  };

  const requestRefund = async (paymentId: string, reason: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in to request refund');
    
    setIsLoading(true);
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) throw new Error('Payment not found');

      const newRefund: RefundRequest = {
        id: Date.now().toString(),
        paymentId: paymentId,
        amount: payment.amount,
        reason: reason,
        status: 'pending',
        requestedAt: new Date()
      };

      const updatedRefunds = [...refundRequests, newRefund];
      setRefundRequests(updatedRefunds);
      localStorage.setItem('shareride_refunds', JSON.stringify(updatedRefunds));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRefundStatus = (paymentId: string): RefundRequest | undefined => {
    return refundRequests.find(refund => refund.paymentId === paymentId);
  };

  const value = {
    payments,
    paymentMethods,
    isLoading,
    processPayment,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
    getPaymentHistory,
    requestRefund,
    getRefundStatus
  };

  return <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>;
};
