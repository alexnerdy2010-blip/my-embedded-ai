import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const SOURCE_INFO = [
  {
    title: "Official Basketball Rules 2024",
    pages: 105,
    description: "Complete FIBA basketball rules including game structure, violations, fouls, and playing regulations.",
    topics: ["Game Structure", "Court & Equipment", "Teams", "Playing Regulations", "Violations", "Fouls"]
  },
  {
    title: "Official Interpretations 2024",
    pages: 142,
    description: "Detailed interpretations and clarifications of complex rule situations with examples.",
    topics: ["Traveling Cases", "Shot Clock Situations", "Goaltending Examples", "Foul Interpretations", "Special Situations"]
  },
  {
    title: "Basketball Equipment Specifications",
    pages: 31,
    description: "Technical specifications for basketball equipment including court, ball, and facilities.",
    topics: ["Court Dimensions", "Basket Specifications", "Ball Standards", "Lighting", "Safety Requirements"]
  }
];

export const SourceDataPanel = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <BookOpen className="w-4 h-4" />
          View Source Data
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Embedded Knowledge Base</SheetTitle>
          <SheetDescription>
            Complete FIBA 2024 basketball documentation (278 pages)
          </SheetDescription>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-6">
            {SOURCE_INFO.map((doc, index) => (
              <div key={index} className="space-y-3 pb-6 border-b last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {doc.pages} pages • Valid as of October 1, 2024
                    </p>
                  </div>
                </div>
                
                <p className="text-sm text-foreground/80">{doc.description}</p>
                
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Topics Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {doc.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 bg-secondary rounded-md text-secondary-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">How This Works</p>
              <ul className="text-sm text-foreground/70 space-y-1 list-disc list-inside">
                <li>All rules are embedded directly in the app</li>
                <li>No external uploads needed</li>
                <li>AI references exact articles and sections</li>
                <li>Answers based only on official FIBA 2024 rules</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
