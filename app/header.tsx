import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { createPaper } from "@/convex/papers";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from 'next/image';
import { HeaderActions } from "./header-actions";


export function Header() {
    return <div className="bg-slate-900 py-4">
    <div className="container mx-auto flex justify-between items-center">
    <div className = "flex items-center gap-4 text-2xl font-bold">
        <Image src="/logo.svg" width={40} height={40} alt="PaperBank Logo" />
        PaperBank
    </div>
        <div className = "flex gap-4 items-center">
            <ModeToggle />

            <HeaderActions />
        </div>

        </div>
    </div>;
}