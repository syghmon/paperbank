'use client'

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Trash, TrashIcon } from "lucide-react";
import { useParams } from "next/navigation"
import { RemoveNoteButton } from "./remove-note-button";



export default function NotePage() {
    const {noteId} = useParams<{noteId: Id<"notes">}>();
    const note = useQuery(api.notes.getNote, {noteId: noteId});

    
    if(!note) return null;

    return (
        <div className="relative bg-slate-800 rounded p-4 w-full">
            <RemoveNoteButton noteId={noteId}/>
            <div className="pr-6 whitespace-pre-line">{note?.text}</div>
        </div>

    );
}