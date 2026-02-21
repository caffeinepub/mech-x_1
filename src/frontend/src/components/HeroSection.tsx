import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Wrench, MessageSquare, MapPin, Shield } from 'lucide-react';

export default function HeroSection() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url(/assets/generated/hero-background.dim_1920x600.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background" />

      {/* Hero Content */}
      <div className="relative container mx-auto px-4 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center mb-6">
            <img
              src="/assets/generated/mech-x-logo.dim_256x256.png"
              alt="MECH X Logo"
              className="h-24 w-24 sm:h-32 sm:w-32"
            />
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            MECH X
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            AI-Powered Automotive Assistance System
          </p>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Get instant solutions and mechanical details during a car breakdown by simply describing the issue to our AI assistant.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={login}
              disabled={isLoggingIn}
              className="text-lg px-8 py-6 gap-2 shadow-lg"
            >
              {isLoggingIn ? (
                <>
                  <Wrench className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  Start Chat
                </>
              )}
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border shadow-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-base">AI Chatbot</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Get instant troubleshooting guidance for any car issue
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border shadow-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-base">Find Mechanics</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Locate nearby mechanics and service centers instantly
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border shadow-card">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-semibold text-base">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Detailed mechanical solutions specific to your vehicle
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
