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
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { useMutation } from "convex/react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

  
  export function RemovePaperButton({paperId}: {paperId: Id<"papers">}) {
    const removePaper = useMutation(api.papers.removePaper)
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter();


    return (
      <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className={btnStyles}>  
            <TrashIcon className={btnIconStyles}/>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Paper</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to remove this paper?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel className="flex gap-1 h-12">Cancel</AlertDialogCancel>
            <LoadingButton 
            onClick={() => {
                setIsLoading(true);
                removePaper({paperId,

                }).then(()=>{ router.push('/');}).finally(() => {setIsLoading(false); });
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