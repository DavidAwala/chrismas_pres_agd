import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gift, Heart, Sparkles, Share2 } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import CreateGiftForm from "@/components/CreateGiftForm";
import SnowAnimation from "@/components/SnowAnimation";
import ConfettiAnimation from "@/components/ConfettiAnimation";
import heroImage from "@/assets/hero-christmas.jpg";
import giftIcon from "@/assets/gift-icon.jpg";

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [showNewYear, setShowNewYear] = useState(false);

  useEffect(() => {
    // Apply theme based on date
    const now = new Date();
    const christmas = new Date(now.getFullYear(), 11, 25);
    const jan1 = new Date(now.getFullYear() + 1, 0, 1);

    if (now >= christmas) {
      document.body.classList.add("theme-christmas");
    }
    if (now.toDateString() === jan1.toDateString()) {
      setShowNewYear(true);
      document.body.classList.add("theme-newyear");
    }

    return () => {
      document.body.classList.remove("theme-christmas", "theme-newyear");
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SnowAnimation />
      {showNewYear && <ConfettiAnimation />}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center py-20">
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full border border-accent/30">
                <Sparkles className="w-5 h-5 text-accent twinkle" />
                <span className="text-accent font-semibold">Spread the Christmas Joy</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Season's Greetings!
            </h1>

            <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Create a magical personalized Christmas message for someone you love. A page just for
              them, with your heartfelt words and festive cheer.
            </p>

            <CountdownTimer />

            <Button
              onClick={() => setShowForm(true)}
              size="lg"
              className="text-lg px-8 py-6 pulse-glow"
            >
              <Gift className="w-6 h-6 mr-2" />
              Create a Personalized Message
            </Button>
          </div>
        </div>
      </section>

      {/* Form Section */}
      {showForm && (
        <section id="create" className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <CreateGiftForm />
          </div>
        </section>
      )}

      {/* How It Works */}
      {!showForm && (
        <section className="py-20 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fade-in-up">
              How It Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Gift,
                  title: "Fill the Form",
                  description: "Enter the recipient's name, your message, and upload an optional image. Use templates for inspiration!",
                },
                {
                  icon: Sparkles,
                  title: "Generate Link",
                  description: "Get a unique, personalized page with festive design, your message, and view tracking",
                },
                {
                  icon: Heart,
                  title: "Share the Love",
                  description: "Share via WhatsApp, Facebook, email or copy the link. Get notified when they like it!",
                },
              ].map((step, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow animate-fade-in-up">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button onClick={() => setShowForm(true)} size="lg">
                Get Started
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 animate-fade-in-up">
            Features That Sparkle
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex gap-6 animate-fade-in-up">
              <div className="flex-shrink-0">
                <img src={giftIcon} alt="Gift" className="w-16 h-16 rounded-lg" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">A Page Just For Them</h3>
                <p className="text-muted-foreground">
                  Every link creates a unique, personalized landing page with their name, your
                  message, and optional images.
                </p>
              </div>
            </div>

            <div className="flex gap-6 animate-fade-in-up">
              <div className="flex-shrink-0">
                <Heart className="w-16 h-16 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Smart Templates</h3>
                <p className="text-muted-foreground">
                  Choose from beautiful pre-written messages for family, friends, and loved ones. Customize them to make them your own.
                </p>
              </div>
            </div>

            <div className="flex gap-6 animate-fade-in-up">
              <div className="flex-shrink-0">
                <BarChart3 className="w-16 h-16 text-accent twinkle" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Track Engagement</h3>
                <p className="text-muted-foreground">
                  See how many people viewed and liked your messages. Get email notifications when recipients interact with your gifts.
                </p>
              </div>
            </div>

            <div className="flex gap-6 animate-fade-in-up">
              <div className="flex-shrink-0">
                <Sparkles className="w-16 h-16 text-accent twinkle" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Celebrate On The Day</h3>
                <p className="text-muted-foreground">
                  Watch the design transform on Christmas Day with richer colors and on New Year with
                  celebratory confetti.
                </p>
              </div>
            </div>

            <div className="flex gap-6 animate-fade-in-up">
              <div className="flex-shrink-0">
                <Heart className="w-16 h-16 text-secondary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Easy Social Sharing</h3>
                <p className="text-muted-foreground">
                  One-click sharing to WhatsApp, Facebook, Twitter, or email. Recipients can like and share with others too!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground mb-2">
            Made with <Heart className="w-4 h-4 inline fill-current text-secondary" /> for Christmas 2025
          </p>
          <p className="text-sm text-muted-foreground">
            Spread love, joy, and festive cheer this holiday season
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
