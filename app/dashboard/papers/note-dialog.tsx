import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StickyNote } from 'lucide-react';
import { useAction, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { Doc } from "@/convex/_generated/dataModel";

export function NoteDialog({ paper }: { paper: Doc<'papers'> }) {
  const [note, setNote] = useState(paper.note);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const saveNote = useAction(api.papers.saveNote);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setNote(paper.note);
  }, [paper.note]);

  const handleSaveNote = async () => {
    try {
      await saveNote({
        paperId: paper._id,
        note,
        title: paper.title,
        summary: paper.summary,
      });
      console.log(`Note saved:`, note);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleDialogClose = async () => {
    await handleSaveNote();
    setIsDialogOpen(false);
  };

  const handleOpenChange = async (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
    if (isOpen) {
      // Ensure textarea is focused and cursor is at the end
      setNote(paper.note);
      // Adding a slight delay to ensure the dialog is fully rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = textareaRef.current.value.length;
        }
      }, 0);
    } else {
      await handleDialogClose();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2 transition-colors duration-300 ease-in-out hover:bg-slate-300 dark:hover:bg-slate-900">
          <StickyNote className="w-4 h-4" />
          Note
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <textarea
            ref={textareaRef}
            className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-700"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={15}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="default" onClick={async () => { 
              await handleSaveNote(); 
              setIsDialogOpen(false);
            }}>Save</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
