import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface BackButtonProps {
  to?: string;
  label?: string;
  className?: string;
}

export function BackButton({ to = "/", label = "Back to Home", className = "" }: BackButtonProps) {
  return (
    <Link href={to}>
      <Button 
        variant="outline" 
        size="sm" 
        className={`mb-6 hover:bg-slate-50 ${className}`}
        data-testid="button-back"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {label}
      </Button>
    </Link>
  );
}