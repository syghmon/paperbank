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

export function PaperCard({ paper }: { paper: Doc<'papers'> }) {
  return (
    <Card className="relative group h-full flex flex-col transition-colors duration-300 ease-in-out hover:bg-slate-200 dark:hover:bg-slate-700 hover:border-slate-300">
      <Link href={`/dashboard/papers/${paper._id}`} className="absolute inset-0 z-10" />
      <CardHeader className="relative z-20">
        <CardTitle>{paper.title}</CardTitle>
      </CardHeader>
      <CardContent className="relative flex-grow flex justify-center items-center z-20">
        <p>{!paper.description ? <Loader2 className="animate-spin" /> : paper.description}</p>
      </CardContent>
      <CardFooter className="relative z-20 flex justify-between items-end">
        <Button
          asChild
          variant="secondary"
          className="flex items-center gap-2 transition-colors duration-300 ease-in-out hover:bg-slate-300 dark:hover:bg-slate-900 z-30">

            <Link href={`/dashboard/papers/${paper._id}/note`}>
              <StickyNote className="w-4 h-4" />
              Note
            </Link>
        </Button>
        <div className="hidden group-hover:flex items-center z-30">
          <RemovePaperButton paperId={paper._id} />
        </div>
      </CardFooter>
    </Card>
  );
}
