'use client'

import { LoadingButton } from "@/components/loading-button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { removeNote } from "@/convex/notes";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { useMutation } from "convex/react";
import { Trash, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

  
  export function RemoveNoteButton({noteId}: {noteId: Id<"notes">}) {
    const removeNote= useMutation(api.notes.removeNote)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();


    return (
      <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <AlertDialogTrigger asChild>
            <Button className="absolute top-3 right-3" size= "icon" variant={"destructive"}>
                <Trash/>
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Note</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to remove this Note?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <LoadingButton 
            onClick={() => {
                setIsLoading(true);
                removeNote({noteId,}).then(()=>{ router.push('/dashboard/notes');}).finally(() => {setIsLoading(false); });
            }}
            isLoading={isLoading} 
            loadingText="Removing...">
              Remove
            </LoadingButton>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }