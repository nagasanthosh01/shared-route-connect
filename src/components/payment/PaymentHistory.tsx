
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, RefreshCw, AlertCircle } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const PaymentHistory: React.FC = () => {
  const { payments, getPaymentHistory, requestRefund, getRefundStatus } = usePayment();
  const { user } = useAuth();
  const { toast } = useToast();

  const userPayments = user ? getPaymentHistory(user.id) : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleRefundRequest = async (paymentId: string) => {
    try {
      await requestRefund(paymentId, 'User requested refund');
      toast({
        title: "Refund requested",
        description: "Your refund request has been submitted for review",
      });
    } catch (error) {
      toast({
        title: "Refund request failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  if (userPayments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No payment history</h3>
          <p className="text-gray-600 text-center">
            Your completed payments will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {userPayments.map((payment) => {
        const refundStatus = getRefundStatus(payment.id);
        
        return (
          <Card key={payment.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Payment #{payment.id.slice(-6)}
                  </CardTitle>
                  <CardDescription>
                    {payment.createdAt.toLocaleDateString()} at {payment.createdAt.toLocaleTimeString()}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${payment.amount}</div>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-600">Payment Method</div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4" />
                    <span>
                      {payment.paymentMethod.type === 'card' 
                        ? `**** ${payment.paymentMethod.last4}` 
                        : payment.paymentMethod.type.toUpperCase()
                      }
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">Booking ID</div>
                  <div>#{payment.bookingId}</div>
                </div>
              </div>

              {refundStatus ? (
                <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">
                    Refund {refundStatus.status} - ${refundStatus.amount}
                  </span>
                </div>
              ) : payment.status === 'completed' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRefundRequest(payment.id)}
                >
                  Request Refund
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PaymentHistory;
