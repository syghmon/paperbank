'use client'

import { cn } from "@/lib/utils";
import { ClipboardPen, Cog, FilesIcon, LayoutDashboard, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";




export default function SideNav() {

  const pathname = usePathname();
  return (
        <nav>
            <ul className="space-y-4">
                <li>
                <Link className={cn(
                        "font-light text-xl flex gap-2 items-center hover:text-cyan-400 dark:hover:text-cyan-100",
                        {
                        "text-cyan-400": pathname.endsWith("/dashboard/search")
                        }

                    )} href="/dashboard/search">
                    <Search/>
                    Search</Link>
                </li>
                <li>
                    <Link className={cn(
                        "font-light text-xl flex gap-2 items-center hover:text-cyan-400 dark:hover:text-cyan-100",
                        {
                        "text-cyan-400": pathname.endsWith("/dashboard/papers")
                        }

                    )} href="/dashboard/papers">
                    <FilesIcon/>
                    Papers</Link>

                </li>
                <li>
                <Link className={cn(
                        "font-light text-xl flex gap-2 items-center hover:text-cyan-400 dark:hover:text-cyan-100",
                        {
                        "text-cyan-400": pathname.endsWith("/dashboard/notes")
                        }

                    )} href="/dashboard/notes">
                    <ClipboardPen/>
                    Notes</Link>
                </li>
                <li>
                <Link className={cn(
                        "font-light text-xl flex gap-2 items-center hover:text-cyan-500",
                        {
                        "text-cyan-400": pathname.endsWith("/dashboard/settings")
                        }

                    )} href="/dashboard/settings">
                    <Cog/>
                    Settings</Link>
                </li>
            </ul>
        </nav>
  );
}
