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
import AddPaperButton from "./add-paper-form";
import {useState} from "react";
  

export default function CreatePaperButton() {
    const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog onOpenChange= {setIsOpen} open = {isOpen}>
        <DialogTrigger asChild>
        <Button> Add Paper </Button></DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add a research paper</DialogTitle>
                <DialogDescription>
                    Add a paper to search over in the future.
                </DialogDescription>
                <AddPaperButton onAdd={() => setIsOpen(false)}/>
            </DialogHeader>
        </DialogContent>
    </Dialog>
    );
}
