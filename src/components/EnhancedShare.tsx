import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EnhancedShareProps {
  url: string;
  title: string;
  text: string;
}

const EnhancedShare = ({ url, title, text }: EnhancedShareProps) => {
  const [copied, setCopied] = useState(false);

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "💬",
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`,
          "_blank"
        );
      },
    },
    {
      name: "Facebook",
      icon: "📘",
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      name: "Twitter",
      icon: "🐦",
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
      },
    },
    {
      name: "Email",
      icon: "📧",
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
          `${text}\n\n${url}`
        )}`;
      },
    },
    {
      name: "Copy Link",
      icon: copied ? "✅" : "🔗",
      action: () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        toast.success("Link copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      },
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
        console.log("Share cancelled");
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="lg" variant="outline" className="gap-2">
          <Share2 className="w-5 h-5" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share via...
          </DropdownMenuItem>
        )}
        {shareOptions.map((option) => (
          <DropdownMenuItem key={option.name} onClick={option.action}>
            <span className="mr-2">{option.icon}</span>
            {option.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedShare;
