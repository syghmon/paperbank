import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";


export function LoadingButton({
  isLoading, 
  children, 
  loadingText,
  onClick,
}: {
  isLoading: boolean, 
  children: React.ReactNode, 
  loadingText: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}) {
  return (
    <Button 
    className="flex gap-1 h-12"
    disabled={isLoading} 
    type="submit"
    onClick={(e) => {onClick?.(e);}}
    >

    {isLoading && <Loader2 className="animate-spin" />}
    {isLoading ? loadingText : children}
  </Button>
  );
}