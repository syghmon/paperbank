import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";


export function LoadingButton({
  isLoading, 
  children, 
  loadingText
}: {
  isLoading: boolean, 
  children: React.ReactNode, 
  loadingText: string
}) {
  return (
    <Button 
    className="flex gap-1"
    disabled={isLoading} 
    type="submit"
    >

    {isLoading && <Loader2 className="animate-spin" />}
    {isLoading ? loadingText : children}
  </Button>
  );
}