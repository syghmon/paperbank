'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddPaperButton from "./add-paper-form";
import { useState } from "react";
import { Plus } from "lucide-react";

export default function CreatePaperButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Paper
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a research paper</DialogTitle>
          <DialogDescription>
            Add a paper to search over in the future.
          </DialogDescription>
          <AddPaperButton onAdd={() => setIsOpen(false)} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
