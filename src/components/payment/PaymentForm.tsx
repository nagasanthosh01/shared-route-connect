
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Smartphone, Wallet, Plus } from 'lucide-react';
import { usePayment } from '@/contexts/PaymentContext';
import { useToast } from '@/hooks/use-toast';

interface PaymentFormProps {
  amount: number;
  bookingId: string;
  onPaymentSuccess: (paymentId: string) => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  amount, 
  bookingId, 
  onPaymentSuccess, 
  onCancel 
}) => {
  const { paymentMethods, processPayment, addPaymentMethod, isLoading } = usePayment();
  const { toast } = useToast();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: ''
  });

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast({
        title: "Payment method required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    try {
      const payment = await processPayment(bookingId, amount, selectedPaymentMethod);
      toast({
        title: "Payment processing",
        description: "Your payment is being processed...",
      });
      
      // Wait for payment completion (simulated)
      setTimeout(() => {
        toast({
          title: "Payment successful!",
          description: `Payment of $${amount} completed successfully`,
        });
        onPaymentSuccess(payment.id);
      }, 2000);
    } catch (error) {
      toast({
        title: "Payment failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddCard = async () => {
    try {
      await addPaymentMethod({
        type: 'card',
        last4: newCard.cardNumber.slice(-4),
        brand: 'visa', // This would be detected from card number
        expiryMonth: parseInt(newCard.expiryMonth),
        expiryYear: parseInt(newCard.expiryYear),
        isDefault: paymentMethods.length === 0
      });
      
      setShowAddCard(false);
      setNewCard({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', holderName: '' });
      
      toast({
        title: "Card added",
        description: "Payment method added successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to add card",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'upi': return <Smartphone className="h-4 w-4" />;
      case 'wallet': return <Wallet className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Amount to pay: <span className="text-2xl font-bold text-green-600">${amount}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Method Selection */}
        <div className="space-y-4">
          <Label>Select Payment Method</Label>
          
          {paymentMethods.length > 0 && (
            <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Choose payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center space-x-2">
                      {getPaymentIcon(method.type)}
                      <span>
                        {method.type === 'card' 
                          ? `**** **** **** ${method.last4}` 
                          : method.type.toUpperCase()
                        }
                      </span>
                      {method.isDefault && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Add New Card */}
          {!showAddCard ? (
            <Button 
              variant="outline" 
              onClick={() => setShowAddCard(true)}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Card
            </Button>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={newCard.cardNumber}
                    onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryMonth">Month</Label>
                  <Input
                    id="expiryMonth"
                    placeholder="MM"
                    value={newCard.expiryMonth}
                    onChange={(e) => setNewCard({...newCard, expiryMonth: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryYear">Year</Label>
                  <Input
                    id="expiryYear"
                    placeholder="YYYY"
                    value={newCard.expiryYear}
                    onChange={(e) => setNewCard({...newCard, expiryYear: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="holderName">Card Holder</Label>
                  <Input
                    id="holderName"
                    placeholder="John Doe"
                    value={newCard.holderName}
                    onChange={(e) => setNewCard({...newCard, holderName: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddCard} className="flex-1">
                  Add Card
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddCard(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Payment Actions */}
        <div className="flex space-x-4">
          <Button 
            onClick={handlePayment}
            disabled={!selectedPaymentMethod || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Pay $${amount}`
            )}
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
