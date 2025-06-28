
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Payment, PaymentMethod, RefundRequest } from '@/types/payment';
import { useAuth } from './AuthContext';
import {
  createPayment,
  simulatePaymentProcessing,
  createPaymentMethod,
  updatePaymentMethodDefault,
  filterUserPayments,
  createRefundRequest
} from '@/services/paymentService';
import {
  savePaymentsToStorage,
  loadPaymentsFromStorage,
  savePaymentMethodsToStorage,
  loadPaymentMethodsFromStorage,
  saveRefundsToStorage,
  loadRefundsFromStorage
} from '@/services/paymentStorageService';

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
    const loadedPayments = loadPaymentsFromStorage();
    const loadedPaymentMethods = loadPaymentMethodsFromStorage();
    const loadedRefunds = loadRefundsFromStorage();
    
    setPayments(loadedPayments);
    setPaymentMethods(loadedPaymentMethods);
    setRefundRequests(loadedRefunds);
  }, []);

  const processPayment = async (bookingId: string, amount: number, paymentMethodId: string): Promise<Payment> => {
    if (!user) throw new Error('User must be logged in to process payment');
    
    setIsLoading(true);
    try {
      const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
      if (!paymentMethod) throw new Error('Payment method not found');

      const newPayment = createPayment(bookingId, amount, paymentMethod);

      simulatePaymentProcessing(newPayment, (completedPayment) => {
        const updatedPayments = payments.map(p => p.id === newPayment.id ? completedPayment : p);
        if (!updatedPayments.find(p => p.id === newPayment.id)) {
          updatedPayments.push(completedPayment);
        }
        setPayments(updatedPayments);
        savePaymentsToStorage(updatedPayments);
      });

      const updatedPayments = [...payments, newPayment];
      setPayments(updatedPayments);
      savePaymentsToStorage(updatedPayments);

      return newPayment;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addPaymentMethod = async (paymentMethodData: Omit<PaymentMethod, 'id'>): Promise<void> => {
    if (!user) throw new Error('User must be logged in to add payment method');
    
    setIsLoading(true);
    try {
      const newPaymentMethod = createPaymentMethod(paymentMethodData);
      const updatedMethods = [...paymentMethods, newPaymentMethod];
      setPaymentMethods(updatedMethods);
      savePaymentMethodsToStorage(updatedMethods);
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
      savePaymentMethodsToStorage(updatedMethods);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<void> => {
    setIsLoading(true);
    try {
      const updatedMethods = updatePaymentMethodDefault(paymentMethods, paymentMethodId);
      setPaymentMethods(updatedMethods);
      savePaymentMethodsToStorage(updatedMethods);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentHistory = (userId: string): Payment[] => {
    return filterUserPayments(payments);
  };

  const requestRefund = async (paymentId: string, reason: string): Promise<void> => {
    if (!user) throw new Error('User must be logged in to request refund');
    
    setIsLoading(true);
    try {
      const payment = payments.find(p => p.id === paymentId);
      if (!payment) throw new Error('Payment not found');

      const newRefund = createRefundRequest(paymentId, payment, reason);
      const updatedRefunds = [...refundRequests, newRefund];
      setRefundRequests(updatedRefunds);
      saveRefundsToStorage(updatedRefunds);
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
