import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Gift, Loader2, Copy, Check } from "lucide-react";
import TemplateSelector from "./TemplateSelector";
import EnhancedShare from "./EnhancedShare";

const CreateGiftForm = () => {
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [relation, setRelation] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      // Upload image if provided
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("gift-images")
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("gift-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }

      // Create gift message
      const slug = generateSlug();
      const { error: insertError } = await supabase
        .from("gift_messages")
        .insert({
          slug,
          recipient_name: recipientName,
          sender_name: senderName || "Someone special",
          sender_email: senderEmail || null,
          relation: relation || "Friend",
          message,
          image_url: imageUrl,
        });

      if (insertError) throw insertError;

      const link = `${window.location.origin}/gift/${slug}`;
      setGeneratedLink(link);
      toast.success("Your personalized gift page has been created!");

      // Reset form
      setRecipientName("");
      setSenderName("");
      setSenderEmail("");
      setRelation("");
      setMessage("");
      setImageFile(null);
    } catch (error) {
      console.error("Error creating gift:", error);
      toast.error("Failed to create gift page. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (generatedLink) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Gift className="w-12 h-12 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl">Gift Page Created! 🎁</CardTitle>
          <CardDescription>Share this link with {recipientName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-muted rounded-lg break-all text-center font-mono text-sm">
            {generatedLink}
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={copyLink} variant="secondary">
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
            <EnhancedShare
              url={generatedLink}
              title={`Christmas Gift for ${recipientName}`}
              text={`Check out this special Christmas message I created for you!`}
            />
            <Button onClick={() => setGeneratedLink("")}>Create Another</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">Create a Personalized Message</CardTitle>
        <CardDescription>Fill in the details to create a special Christmas page</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Name *</Label>
            <Input
              id="recipient"
              placeholder="Who is this for?"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sender">Your Name</Label>
            <Input
              id="sender"
              placeholder="Your name (optional)"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Your Email (for notifications)</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com (optional)"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              We'll notify you when someone likes your message
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relation">Relation</Label>
            <Select value={relation} onValueChange={setRelation}>
              <SelectTrigger>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mom">Mom</SelectItem>
                <SelectItem value="Dad">Dad</SelectItem>
                <SelectItem value="Uncle">Uncle</SelectItem>
                <SelectItem value="Aunt">Aunt</SelectItem>
                <SelectItem value="Friend">Friend</SelectItem>
                <SelectItem value="Partner">Partner</SelectItem>
                <SelectItem value="Sibling">Sibling</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Your Message *</Label>
            <Textarea
              id="message"
              placeholder="Write your heartfelt Christmas message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={6}
            />
          </div>

          <TemplateSelector
            onSelect={setMessage}
            recipientName={recipientName}
            senderName={senderName}
          />

          <div className="space-y-2">
            <Label htmlFor="image">Image (optional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create Gift Page
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateGiftForm;


