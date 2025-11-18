import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Share2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SnowAnimation from "@/components/SnowAnimation";
import ConfettiAnimation from "@/components/ConfettiAnimation";
import ornamentImage from "@/assets/ornament.jpg";

interface GiftMessage {
  recipient_name: string;
  sender_name: string;
  relation: string;
  message: string;
  image_url: string;
  likes_count: number;
  id: string;
}

const PersonalizedGift = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gift, setGift] = useState<GiftMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
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

  useEffect(() => {
    const fetchGift = async () => {
      if (!slug) return;

      try {
        const { data, error } = await supabase
          .from("gift_messages")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) throw error;
        setGift(data);
      } catch (error) {
        console.error("Error fetching gift:", error);
        toast.error("Gift page not found");
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [slug]);

  const handleLike = async () => {
    if (!gift || liked) return;

    try {
      const { error } = await supabase
        .from("gift_messages")
        .update({ likes_count: (gift.likes_count || 0) + 1 })
        .eq("id", gift.id);

      if (error) throw error;

      setLiked(true);
      setGift({ ...gift, likes_count: (gift.likes_count || 0) + 1 });
      toast.success("Thank you for liking! ❤️");
    } catch (error) {
      console.error("Error liking gift:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Christmas Gift from ${gift?.sender_name}`,
        text: `Check out this personalized Christmas message!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-xl">Gift page not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SnowAnimation />
      {showNewYear && <ConfettiAnimation />}

      {/* Decorative Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <img src={ornamentImage} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Greeting */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Merry Christmas, {gift.recipient_name}!
            </h1>
            <p className="text-xl text-muted-foreground">
              A special message from {gift.sender_name}
            </p>
          </div>

          {/* Image */}
          {gift.image_url && (
            <div className="mb-8 animate-fade-in-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-accent/20">
                <img
                  src={gift.image_url}
                  alt="Gift"
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            </div>
          )}

          {/* Message Card */}
          <Card className="shadow-2xl animate-fade-in-up">
            <CardContent className="p-8 md:p-12">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                  To my dear {gift.relation}
                </p>
                <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full" />
              </div>

              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-lg leading-relaxed whitespace-pre-wrap text-foreground">
                  {gift.message}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-semibold text-primary">
                  Love, {gift.sender_name}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-8 flex gap-4 justify-center animate-fade-in-up">
            <Button
              onClick={handleLike}
              disabled={liked}
              size="lg"
              variant={liked ? "secondary" : "default"}
              className="gap-2"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
              {liked ? "Liked" : "Like This"} ({gift.likes_count || 0})
            </Button>
            <Button onClick={handleShare} size="lg" variant="outline" className="gap-2">
              <Share2 className="w-5 h-5" />
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedGift;
