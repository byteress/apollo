import type { BookingPayload, Booking, FacebookPost } from '../types';
import { BACKEND_URL } from '../config';

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

export const fetchFacebookPosts = async (): Promise<FacebookPost[]> => {
  const url = `${BACKEND_URL}/api/posts`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error('Unable to reach the backend server. Please check your connection.');
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.detail ?? 'Failed to fetch Facebook posts.');
  }

  return (data.data ?? []) as FacebookPost[];
};
