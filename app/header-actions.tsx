'use client'
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
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

    <AuthLoading>Loading...</AuthLoading>
    </>
    );
}