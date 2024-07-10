"use client"

import { ModeToggle } from "@/components/ui/mode-toggle";
import { ClerkLoaded, ClerkLoading, SignInButton, UserButton } from "@clerk/nextjs";
import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";
import Link from "next/link";
import { BookMarked } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  return (
    <div className="z-10 relative dark:bg-slate-900 bg-slate-50 py-4 dark:bg-opacity-40 bg-opacity-70">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex gap-12 items-center">
          <Link href="/" className="flex items-center gap-4 text-2xl font-bold">
            <BookMarked className="black w-10 h-10" />
            PaperBank
          </Link>
          <nav className="gap-12">

            <Link href="/dashboard/search" className="hover:text-slate-300">
              Search
            </Link>
            <Link href="/dashboard/papers" className="hover:text-slate-300">
              Papers
            </Link>
            <Link href="/dashboard/recommendations" className="hover:text-slate-300">
              Recommendations
            </Link>
            <Link href="/dashboard/settings" className="hover:text-slate-300">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex gap-4 items-center">
          <ModeToggle />
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
  );
}
