
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
    <Button variant={"secondary"}>View</Button>
  </CardFooter>
</Card>
);
}
