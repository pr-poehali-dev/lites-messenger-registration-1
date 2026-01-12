import { useState } from 'react';
import Registration from '@/components/Registration';
import MessengerApp from '@/components/MessengerApp';

export default function Index() {
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!isRegistered ? (
        <Registration onComplete={() => setIsRegistered(true)} />
      ) : (
        <MessengerApp />
      )}
    </div>
  );
}