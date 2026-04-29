import Pusher from 'pusher';
import PusherClient from 'pusher-js';

// Server-side Pusher instance
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || 'dummy',
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'dummy',
  secret: process.env.PUSHER_SECRET || 'dummy',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'dummy',
  useTLS: true,
});

// Client-side Pusher instance
const getPusherClient = () => {
  if (typeof window !== 'undefined') {
    return new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY || 'dummy',
      {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'dummy',
      }
    );
  }
  return null;
};

export const pusherClient = getPusherClient();
