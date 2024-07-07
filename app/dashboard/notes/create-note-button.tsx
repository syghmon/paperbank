'use client'

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import CreateNoteForm from "./create-note-form";
import {useState} from "react";
import { Plus } from "lucide-react";
import { btnIconStyles, btnStyles } from "@/styles/styles";
import { useToast } from "@/components/ui/use-toast";


export default function CreateNoteButton() {
    const [isOpen, setIsOpen] = useState(false)
    const {toast} = useToast();

  return (
    <Dialog onOpenChange= {setIsOpen} open = {isOpen}>
        <DialogTrigger asChild>
        <Button
        className={btnStyles}> 
            <Plus className={btnIconStyles}/> 
            Create Note
         </Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Create a Note</DialogTitle>
                <DialogDescription>
                    Add a note to search over in the future.
                </DialogDescription>
                <CreateNoteForm onNoteAdd={() => 
                    {setIsOpen(false);
                    toast({
                        title: "Note created",
                        description: "Your note has been created successfully",
                        });
                    }}
                    />

            </DialogHeader>
        </DialogContent>
    </Dialog>
    );
}
