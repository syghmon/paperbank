"use client";

import { ModeToggle } from "@/components/ui/mode-toggle";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { BookMarked } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  return (
    <header className="z-10 relative dark:bg-slate-900 bg-slate-50 py-4 dark:bg-opacity-40 bg-opacity-70">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-4 text-2xl font-bold">
            <BookMarked className="w-10 h-10 dark:text-white text-black" />
            PaperBank
          </Link>
        </div>
        <nav className="flex-1 flex justify-center gap-16 text-lg">
          <Link href="/dashboard/search" className="hover:text-slate-300">
            Search
          </Link>
          <Link href="/dashboard/papers" className="hover:text-slate-300">
            Papers
          </Link>
          <Link href="/dashboard/recommendations" className="hover:text-slate-300">
            Recommendations
          </Link>
        </nav>
        <div className="flex items-center gap-4" style={{ minWidth: '150px' }}>
          <ModeToggle />
          <div className="relative">
            <AuthLoading>
              <Skeleton className="h-7 w-7 rounded-full" />
            </AuthLoading>
            <Unauthenticated>
              <SignInButton />
            </Unauthenticated>
            <Authenticated>
              <UserButton />
            </Authenticated>
          </div>
        </div>
      </div>
    </header>
  );
}
