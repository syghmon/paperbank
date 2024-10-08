'use client'
import { Button } from '@/components/ui/button';
import { ClerkLoaded, ClerkLoading, SignInButton } from '@clerk/nextjs';
import { useState } from 'react';
import Background from './background';

export default function LandingPage() {

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background />
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="dark:text-gray-50 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Keep Your Research Library Organized
            </h1>
            <p className="dark:text-gray-100 mt-6 text-lg leading-8 text-gray-600">
            Easy Import and Management of arXiv Papers
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <ClerkLoading>
                <Button className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font dark:text-black text-white dark:bg-white bg-black">
                  Get started
                </Button>
              </ClerkLoading>
              <ClerkLoaded>
                <SignInButton signUpForceRedirectUrl="/dashboard/papers" forceRedirectUrl="/dashboard/papers">
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
