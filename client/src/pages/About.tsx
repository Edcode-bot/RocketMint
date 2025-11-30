import { Rocket, Star, Trophy, Wallet, Heart, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarField } from "@/components/game/StarField";

export default function About() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <StarField count={40} />
      
      <header className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-celo-gradient flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">About RocketMint</h1>
            <p className="text-xs text-muted-foreground">Celo Prediction Game</p>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 p-4 space-y-6">
        <section className="text-center py-8">
          <Badge variant="secondary" className="mb-4 bg-celo-green/20 text-celo-green border-celo-green/30">
            Built on Celo
          </Badge>
          <h2 className="font-display text-3xl font-bold mb-4">
            Predict. Launch. Earn.
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            RocketMint is a fun prediction game built on the Celo blockchain. 
            Choose a planet, launch the rocket, and earn XP rewards for correct predictions!
          </p>
        </section>
        
        <div className="grid gap-4">
          <FeatureCard
            icon={<Rocket className="w-6 h-6 text-celo-green" />}
            title="Simple Gameplay"
            description="Pick a planet, launch the rocket, and see where it lands. No complicated rules - just pure fun!"
          />
          <FeatureCard
            icon={<Star className="w-6 h-6 text-yellow-400" />}
            title="Earn XP Rewards"
            description="Correct predictions earn bonus XP. Build streaks and climb the leaderboard!"
          />
          <FeatureCard
            icon={<Trophy className="w-6 h-6 text-purple-400" />}
            title="Collect Badges"
            description="Unlock achievements as you play. Show off your collection to other players!"
          />
          <FeatureCard
            icon={<Wallet className="w-6 h-6 text-blue-400" />}
            title="MiniPay Integration"
            description="Seamlessly connect with MiniPay for the best mobile experience on Celo."
          />
        </div>
        
        <Card className="border-white/10 bg-white/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">How to Play</h3>
            <ol className="space-y-4">
              <Step number={1} text="Connect your wallet (MiniPay or any Celo-compatible wallet)" />
              <Step number={2} text="Select a planet from the carousel - each has different XP multipliers" />
              <Step number={3} text="Press 'Launch Rocket' to submit your prediction" />
              <Step number={4} text="Watch the rocket fly and see where it lands!" />
              <Step number={5} text="Earn XP based on your prediction accuracy and planet multiplier" />
            </ol>
          </CardContent>
        </Card>
        
        <Card className="border-celo-green/30 bg-celo-green/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-celo-green/20 flex items-center justify-center">
                <Heart className="w-6 h-6 text-celo-green" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Built for Celo Hackathon</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  RocketMint was created for the Celo HackersDAO + Celo Africa DAO Hackathon.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex flex-col gap-3">
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => window.open("https://docs.celo.org", "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            Learn about Celo
          </Button>
          <Button 
            variant="outline" 
            className="w-full gap-2"
            onClick={() => window.open("https://www.opera.com/products/minipay", "_blank")}
          >
            <ExternalLink className="w-4 h-4" />
            Get MiniPay
          </Button>
        </div>
        
        <footer className="text-center text-sm text-muted-foreground py-8">
          <p>RocketMint v1.0.0</p>
          <p className="mt-1">Built with love on Celo</p>
        </footer>
      </main>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <Card className="border-white/10 bg-white/5">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-celo-green/20 flex items-center justify-center flex-shrink-0">
        <span className="font-bold text-sm text-celo-green">{number}</span>
      </div>
      <p className="text-sm text-muted-foreground pt-1">{text}</p>
    </li>
  );
}
