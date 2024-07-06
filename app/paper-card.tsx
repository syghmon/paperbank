
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
import { Eye,} from "lucide-react";
import Link from "next/link";
  

export function PaperCard({paper}:{paper: Doc<'papers'>}) {

return (
<Card>
  <CardHeader>
    <CardTitle>{paper.title}</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
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
