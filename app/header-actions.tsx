'use client'
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { createPaper } from "@/convex/papers";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";


export function HeaderActions() {
    return (
    <>
    <Unauthenticated>
      <SignInButton />
    </Unauthenticated>

    <Authenticated>
      <UserButton />
    </Authenticated>

    <AuthLoading><Skeleton className="h-7 w-7 rounded-full" /></AuthLoading>
    </>
    );
}