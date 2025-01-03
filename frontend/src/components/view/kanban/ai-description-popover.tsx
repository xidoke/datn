import * as React from "react";
import { Sparkle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { aiService } from "@/services/ai.service";
import { toast } from "@/hooks/use-toast";

interface AIDescriptionPopoverProps {
  onDescriptionGenerated: (description: string) => void;
}

export function AIDescriptionPopover({
  onDescriptionGenerated,
}: AIDescriptionPopoverProps) {
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const handleGenerateDescription = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the AI",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const description = await aiService.generateDescription(prompt);
      onDescriptionGenerated(description);
      setOpen(false);
      setPrompt("");
      toast({
        title: "Success",
        description: "Description generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate description",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-purple-100"
        >
          <Sparkle className="h-4 w-4 text-purple-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">AI Description Generator</h4>
            <p className="text-sm text-muted-foreground">
              Enter keywords or context for your issue description
            </p>
          </div>
          <Textarea
            placeholder="Enter keywords or context..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex justify-end space-x-2">
            <Button onClick={() => setOpen(false)} variant="outline" size="sm">
              Cancel
            </Button>
            <Button
              onClick={handleGenerateDescription}
              disabled={isGenerating}
              size="sm"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
