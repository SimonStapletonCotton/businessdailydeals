import { Link } from "wouter";
import { Ticket, Home, Package, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export function QuickNavigation() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-lg p-3 border border-slate-200">
      <div className="flex flex-col gap-2">
        <Link href="/my-coupons">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Ticket className="h-4 w-4" />
            My Coupons
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/supplier-dashboard">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Package className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}