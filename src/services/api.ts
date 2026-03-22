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

export interface FacebookPostsPage {
  posts: FacebookPost[];
  nextCursor: string | null;
}

export const fetchFacebookPosts = async (after?: string): Promise<FacebookPostsPage> => {
  const params = new URLSearchParams();
  if (after) params.set('after', after);
  const url = `${BACKEND_URL}/api/posts${params.size ? `?${params}` : ''}`;

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

  const nextCursor: string | null = data?.paging?.cursors?.after ?? null;
  const hasNext: boolean = Boolean(data?.paging?.next);

  return {
    posts: (data.data ?? []) as FacebookPost[],
    nextCursor: hasNext ? nextCursor : null,
  };
};
