import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Loader2, Music, Volume2, VolumeX, Play } from "lucide-react";
import { toast } from "sonner";
import SnowAnimation from "@/components/SnowAnimation";
import ConfettiAnimation from "@/components/ConfettiAnimation";
import EnhancedShare from "@/components/EnhancedShare";
import ornamentImage from "@/assets/ornament.jpg";

// --- Custom Intro Animation Component ---
const ChristmasExplosion = ({ onComplete }: { onComplete: () => void }) => {
  const [stage, setStage] = useState<'in' | 'out'>('in');
  const items = ["🎅", "🎄", "🦌", "🔔", "🎁", "🍪", "🧦", "☃️"];
  
  // Generate many items with random positions
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    char: items[i % items.length],
    // Random start positions (clustered in center)
    startX: 50 + (Math.random() * 20 - 10),
    startY: 50 + (Math.random() * 20 - 10),
    // Random end positions (exploded outward)
    endX: (Math.random() * 200) - 50,
    endY: (Math.random() * 200) - 50,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.5,
  }));

  useEffect(() => {
    // Start moving out after 1.5 seconds
    const timer1 = setTimeout(() => setStage('out'), 1800);
    // Unmount completely after animation finishes
    const timer2 = setTimeout(onComplete, 3500);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 transition-opacity duration-1000 ${stage === 'out' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute text-4xl md:text-6xl transition-all duration-[1500ms] ease-out"
          style={{
            left: `${stage === 'in' ? p.startX : p.endX}%`,
            top: `${stage === 'in' ? p.startY : p.endY}%`,
            transform: `rotate(${stage === 'in' ? 0 : p.rotation}deg) scale(${stage === 'in' ? 0.5 : 1.5})`,
            opacity: stage === 'out' ? 0 : 1,
          }}
        >
          {p.char}
        </div>
      ))}
      <div className={`absolute text-white font-bold text-3xl md:text-6xl transition-all duration-500 ${stage === 'out' ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>
        Merry Christmas!
      </div>
    </div>
  );
};

interface GiftMessage {
  recipient_name: string;
  sender_name: string;
  sender_email: string;
  relation: string;
  message: string;
  image_url: string;
  likes_count: number;
  id: string;
  slug: string;
}

const PersonalizedGift = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gift, setGift] = useState<GiftMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showNewYear, setShowNewYear] = useState(false);
  
  // New States for Animation & Audio
  const [showIntro, setShowIntro] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const now = new Date();
    // Check specifically for Dec 25th for the explosion
    const isChristmasDay = now.getMonth() === 11 && now.getDate() === 25;
    // For testing purposes, you can force this to true:
    // const isChristmasDay = true; 

    const christmasStart = new Date(now.getFullYear(), 11, 25);
    const jan1 = new Date(now.getFullYear() + 1, 0, 1);

    if (isChristmasDay) {
      setShowIntro(true);
    }

    if (now >= christmasStart) {
      document.body.classList.add("theme-christmas");
    }
    if (now.toDateString() === jan1.toDateString()) {
      setShowNewYear(true);
      document.body.classList.add("theme-newyear");
    }

    // Initialize Audio (Recommendation: Use a royalty-free Jingle Bells link)
    audioRef.current = new Audio("https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=christmas-background-music-126458.mp3");
    audioRef.current.loop = true;

    return () => {
      document.body.classList.remove("theme-christmas", "theme-newyear");
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
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
        if (data) await supabase.rpc("increment_gift_views", { gift_id: data.id });
      } catch (error) {
        console.error("Error fetching gift:", error);
        toast.error("Gift page not found");
      } finally {
        setLoading(false);
      }
    };
    fetchGift();
  }, [slug]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => toast.error("Click page to enable audio"));
    }
    setIsPlaying(!isPlaying);
  };

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
      
      // Confetti burst on like for extra "dazzle"
      const end = Date.now() + 1000;
      // (Assuming you have access to confetti logic here, otherwise skip)
    } catch (error) {
      console.error("Error liking gift:", error);
    }
  };

  // Helper to format the relation text nicely
  const getRelationText = (relation: string) => {
    if (!relation) return "To a special someone";
    const normalized = relation.toLowerCase().trim();
    if (normalized === 'others' || normalized === 'other') {
      return "To a wonderful person";
    }
    return `To my dear ${relation}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-green-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!gift) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center"><p className="text-xl">Gift page not found</p></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#1a472a] to-[#0f2f1d] text-white">
      
      {/* Styles for floating animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>

      {/* Intro Animation Layer */}
      {showIntro && <ChristmasExplosion onComplete={() => setShowIntro(false)} />}

      <SnowAnimation />
      {showNewYear && <ConfettiAnimation />}

      {/* Decorative Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none mix-blend-overlay">
        <img src={ornamentImage} alt="" className="w-full h-full object-cover" />
      </div>

      {/* Music Toggle - Fixed Top Right */}
      <div className="fixed top-4 right-4 z-40">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMusic}
          className="rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 text-white"
        >
          {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
        </Button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col justify-center">
        <div className="max-w-3xl mx-auto w-full">
          
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-yellow-200 to-red-400 drop-shadow-sm">
              Merry Christmas, {gift.recipient_name}!
            </h1>
            <p className="text-xl text-green-100/80 font-light">
              A special message from {gift.sender_name}
            </p>
          </div>

          {/* Image - Now Rounded and Floating */}
          {gift.image_url && (
            <div className="mb-10 flex justify-center animate-fade-in-up">
              <div className="relative w-64 h-64 md:w-80 md:h-80 group animate-float">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/30 shadow-2xl">
                  <img
                    src={gift.image_url}
                    alt="Gift"
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Cute Decoration on image */}
                <div className="absolute -top-4 -right-4 text-6xl drop-shadow-lg animate-bounce delay-700">
                  🎅
                </div>
              </div>
            </div>
          )}

          {/* Message Card - Glassmorphism Style */}
          <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl animate-fade-in-up overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <div className="mb-8 flex flex-col items-center">
                <p className="text-sm text-yellow-200 uppercase tracking-[0.2em] mb-3 font-semibold">
                  {getRelationText(gift.relation)}
                </p>
                <Heart className="w-6 h-6 text-red-400 fill-red-400/50" />
              </div>

              <div className="prose prose-lg max-w-none mb-10">
                <p className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap text-white font-medium italic">
                  "{gift.message}"
                </p>
              </div>

              <div className="flex justify-center items-center gap-2 mb-6">
                <div className="h-px w-12 bg-white/30"></div>
                <p className="text-lg text-white/80">With Love</p>
                <div className="h-px w-12 bg-white/30"></div>
              </div>
              
              <p className="text-3xl font-serif text-yellow-200">
                {gift.sender_name}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-12 flex gap-4 justify-center animate-fade-in-up flex-wrap">
            <Button
              onClick={handleLike}
              disabled={liked}
              size="lg"
              className={`rounded-full px-8 h-14 text-lg transition-all duration-300 transform hover:scale-105 ${
                liked 
                ? "bg-white/20 text-white hover:bg-white/30" 
                : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
              }`}
            >
              <Heart className={`w-6 h-6 mr-2 ${liked ? "fill-current text-red-400" : "animate-pulse"}`} />
              {liked ? "Liked" : "Send Love"} ({gift.likes_count || 0})
            </Button>
            
            <div className="bg-white rounded-full p-1">
              <EnhancedShare
                url={window.location.href}
                title={`Christmas Gift from ${gift.sender_name}`}
                text={`Check out this special Christmas message for ${gift.recipient_name}!`}
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PersonalizedGift;