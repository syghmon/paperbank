'use client'
import { useQuery } from "convex/react";
import CreateNoteButton from "./create-note-button";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import React, { ReactNode } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
export default function NotesLayout({
    children,
}: {
    children: ReactNode;
})
{
    const notes = useQuery(api.notes.getNotes)
    const {noteId} = useParams<{noteId: Id<"notes">}>();

    const hasNotes = notes && notes.length > 0;

    return <main className="space-y-8">     
    <div className = "flex justify-between items-center">
    <h1 className = "text-4xl font-bold">Notes</h1>
        <CreateNoteButton  />
    </div>

    {!hasNotes && (<div>
        <div className="py-16 flex flex-col items-center justify-center gap-8">
        <Image
          src="/undraw_documents_re_isxv.svg"
          width="200"
          height="200"
          alt="picture of a girl holding a documents" 
        />
        <h2 className="text-2xl">You have no notes</h2>
        <CreateNoteButton />
      </div>
      </div>)}


    {hasNotes && (  
    <div className = "flex gap-12">
    <ul className="space-y-2 w-[200px]">
        {notes?.map((note) => (
        <li key={note._id} className={cn("text-base hover:text-cyan-100",{
            "text-cyan-300": note._id === noteId,

        })}>
        
        <Link href={`/dashboard/notes/${note._id}`}>
        {note.text.substring(0,24) + "..."}</Link>
        </li>
        ))}
        
        </ul>
        
        <div className="w-full">{children}</div>
        </div>

    )}
    </main>  
    ;
}

