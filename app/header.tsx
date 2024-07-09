import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { createPaper } from "@/convex/papers";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from 'next/image';
import { HeaderActions } from "./header-actions";
import Link from "next/link";
import { BookMarked } from "lucide-react";



export function Header() {
    return <div className="z-10 relative dark:bg-slate-900 bg-slate-50 py-4">
    <div className="container mx-auto flex justify-between items-center">
    <div className= "flex gap-12 items-center">
        <Link href="/" className = "flex items-center gap-4 text-2xl font-bold">
            <BookMarked className="black w-10 h-10"/>
            PaperBank
        </Link>

        <nav> <Link href="/dashboard"
        className="hover:text-slate-300">
        Papers</Link>
        </nav>
    </div>
        <div className = "flex gap-4 items-center">
            <ModeToggle />

            <HeaderActions />
        </div>

        </div>
    </div>;
}