'use client'
import { Button } from '@/components/ui/button';
import { ClerkLoaded, ClerkLoading, SignInButton } from '@clerk/nextjs';
import { useState } from 'react';
import { Header } from './header';
import Background from './background';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="dark:text-gray-50 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Keep Track Of All Your Research Readings.
            </h1>
            <p className="dark:text-gray-100 mt-6 text-lg leading-8 text-gray-600">
              Import research papers directly from Arvix and manage them easily.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <ClerkLoading>
                <Button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font dark:text-black text-white dark:bg-white bg-black">
                  Get started
                </Button>
              </ClerkLoading>
              <ClerkLoaded>
                <SignInButton>
                  <Button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font dark:text-black text-white dark:bg-white bg-black">
                    Get started
                  </Button>
                </SignInButton>
              </ClerkLoaded>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
