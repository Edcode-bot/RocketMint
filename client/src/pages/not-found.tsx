import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { StarField } from "@/components/game/StarField";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <StarField count={40} />
      
      <div className="relative z-10 w-full flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md border-white/10 bg-gradient-to-b from-space-purple/30 to-space-dark/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Page Not Found</h1>
            <p className="text-center text-muted-foreground mb-6">
              We couldn't find the page you're looking for. Let's get you back to the game!
            </p>
            
            <Link href="/">
              <Button className="w-full gap-2 bg-celo-gradient hover:brightness-110">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
