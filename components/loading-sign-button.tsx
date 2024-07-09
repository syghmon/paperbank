import { useState, useEffect } from 'react';
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingSignInButton() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading time for the button
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust the timeout duration as needed

    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <Skeleton className="h-10 w-28 rounded-md" />
  ) : (
    <SignInButton>
      <Button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font dark:text-black text-white dark:bg-white bg-black">
        Get started
      </Button>
    </SignInButton>
  );
}
