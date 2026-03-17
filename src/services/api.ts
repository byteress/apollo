import type { BookingPayload, Booking } from '../types';

export const submitBooking = async (payload: BookingPayload): Promise<Booking> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a 2-second network request
      // Randomly fail 10% of the time to show error handling
      if (Math.random() < 0.1) {
        reject(new Error('Failed to submit booking. Please try again.'));
      } else {
        const newBooking: Booking = {
          ...payload,
          id: Math.random().toString(36).substr(2, 9),
          status: 'pending',
          date: new Date().toISOString(),
        };
        resolve(newBooking);
      }
    }, 2000);
  });
};
