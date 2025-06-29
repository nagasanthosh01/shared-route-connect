
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageSquare } from 'lucide-react';
import { useRide } from '@/contexts/RideContext';
import { useAuth } from '@/contexts/AuthContext';
import { Ride, Message } from '@/types/ride';
import { useToast } from '@/hooks/use-toast';

interface RideMessagingProps {
  ride: Ride;
}

const RideMessaging: React.FC<RideMessagingProps> = ({ ride }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { sendMessage, getMessagesForRide, markMessagesAsRead, isLoading } = useRide();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const rideMessages = getMessagesForRide(ride.id);
    setMessages(rideMessages);
    
    // Mark messages as read when component loads
    if (user) {
      markMessagesAsRead(ride.id, user.id);
    }
  }, [ride.id, user]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      await sendMessage(ride.id, newMessage);
      setNewMessage('');
      
      // Refresh messages
      const updatedMessages = getMessagesForRide(ride.id);
      setMessages(updatedMessages);
      
      toast({
        title: "Message sent",
        description: "Your message has been delivered successfully",
      });
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Check if user is involved in this ride
  const isDriver = ride.driverId === user?.id;
  const isPassenger = ride.bookings?.some(booking => booking.passengerId === user?.id);
  const canMessage = isDriver || isPassenger;

  if (!canMessage) {
    return null;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <span>Messages</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-64 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-lg">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {message.senderName} • {formatTime(message.timestamp)}
                  </div>
                  <div className="text-sm">{message.content}</div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={isSending || isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!newMessage.trim() || isSending || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RideMessaging;
