
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc } from "@/convex/_generated/dataModel";
import { Eye, Loader2,} from "lucide-react";
import Link from "next/link";
  

export function PaperCard({paper}:{paper: Doc<'papers'>}) {

return (
<Card>
  <CardHeader>
    <CardTitle>{paper.title}</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex justify-center">
    <p>{!paper.description ? <Loader2 className="animate-spin"/>: paper.description}</p>
    </div>
  </CardContent>
  <CardFooter>
  <Button
      asChild
      variant ="secondary"
      className="flex items-center gap-2"> 
      <Link href={`/papers/${paper._id}`}>
          <Eye className="w-4 h-4" /> 
            View
      </Link>
  </Button>
  </CardFooter>
</Card>
);
}
