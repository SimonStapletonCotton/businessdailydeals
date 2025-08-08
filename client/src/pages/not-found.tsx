import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-slate-50">
      <Navbar />
      <div className="w-full flex items-center justify-center pt-20">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-slate-900">404 Page Not Found</h1>
            </div>

            <p className="mt-4 text-sm text-muted-foreground mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>

            <Link href="/">
              <Button className="w-full" data-testid="button-back-home">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
