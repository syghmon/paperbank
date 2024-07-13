import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Loader2, StickyNote } from "lucide-react";
import Link from "next/link";
import { RemovePaperButton } from "./remove-paper-button";
import { NoteDialog } from "./note-dialog";

export function PaperCard({ paper }: { paper: Doc<'papers'> }) {
  return (
    <Card className="relative group h-full flex flex-col transition-colors duration-300 ease-in-out">
      <div className="hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300 relative flex-grow">
        <Link href={paper.url} className="absolute inset-0 z-10" target="_blank" rel="noopener noreferrer">
          <span className="sr-only">{paper.title}</span>
        </Link>
        <CardHeader>
          <CardTitle>{paper.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex justify-center items-center">
          <p>{!paper.description ? <Loader2 className="animate-spin" /> : paper.description}</p>
        </CardContent>
      </div>
      <hr className="border-t border-gray-300 dark:border-gray-600" />
      <CardFooter onClick={(e) => e.stopPropagation()} className="flex justify-between items-center mt-auto z-20 pt-4">
        <NoteDialog paper={paper} />
        <div className="hidden group-hover:flex items-center">
          <RemovePaperButton paperId={paper._id} />
        </div>
      </CardFooter>
    </Card>
  );
}
