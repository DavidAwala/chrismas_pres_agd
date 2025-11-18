import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, X } from "lucide-react";

interface Template {
  id: string;
  title: string;
  category: string;
  message_template: string;
}

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
  recipientName: string;
  senderName: string;
}

const TemplateSelector = ({ onSelect, recipientName, senderName }: TemplateSelectorProps) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSelector, setShowSelector] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from("gift_templates")
        .select("*")
        .order("category");

      if (!error && data) {
        setTemplates(data);
      }
    };

    fetchTemplates();
  }, []);

  const categories = ["All", ...new Set(templates.map((t) => t.category))];

  const filteredTemplates =
    selectedCategory === "All"
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  const applyTemplate = (template: Template) => {
    let message = template.message_template;
    message = message.replace(/{name}/g, recipientName || "[Recipient Name]");
    message = message.replace(/{sender}/g, senderName || "[Your Name]");
    onSelect(message);
    setShowSelector(false);
  };

  if (!showSelector) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => setShowSelector(true)}
        className="w-full"
      >
        <FileText className="w-4 h-4 mr-2" />
        Use a Template
      </Button>
    );
  }

  return (
    <Card className="my-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Choose a Template</CardTitle>
            <CardDescription>Select from our pre-written messages</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setShowSelector(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full flex-wrap h-auto">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="flex-1">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredTemplates.map((template) => (
                    <Card
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => applyTemplate(template)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{template.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-4">
                          {template.message_template
                            .replace(/{name}/g, recipientName || "[Recipient]")
                            .replace(/{sender}/g, senderName || "[Sender]")}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
