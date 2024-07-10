'use client';

import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/app/providers';
import Background from './background';
import { Header } from './header';

export default function ClientWrapper({ children } : { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main>{children}</main>
      <Toaster />
    </Providers>
  );
}
