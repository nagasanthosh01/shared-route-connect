
import { Ride, Message } from '@/types/ride';

export const createMessage = (rideId: string, content: string, user: any): Message => {
  return {
    id: Date.now().toString(),
    rideId: rideId,
    senderId: user.id,
    senderName: `${user.firstName} ${user.lastName}`,
    senderRole: user.role,
    content: content.trim(),
    timestamp: new Date(),
    read: false
  };
};

export const canSendMessage = (ride: Ride, userId: string): boolean => {
  const isDriver = ride.driverId === userId;
  const isPassenger = ride.bookings?.some(booking => booking.passengerId === userId);
  return isDriver || isPassenger;
};

export const addMessageToRide = (rides: Ride[], rideId: string, newMessage: Message): Ride[] => {
  return rides.map(r => {
    if (r.id === rideId) {
      return {
        ...r,
        messages: [...(r.messages || []), newMessage],
        updatedAt: new Date()
      };
    }
    return r;
  });
};

export const markMessagesAsRead = (rides: Ride[], rideId: string, userId: string): Ride[] => {
  return rides.map(ride => {
    if (ride.id === rideId) {
      const updatedMessages = ride.messages?.map(message => 
        message.senderId !== userId ? { ...message, read: true } : message
      ) || [];
      return {
        ...ride,
        messages: updatedMessages,
        updatedAt: new Date()
      };
    }
    return ride;
  });
};

export const getMessagesForRide = (rides: Ride[], rideId: string): Message[] => {
  const ride = rides.find(r => r.id === rideId);
  return ride?.messages || [];
};
