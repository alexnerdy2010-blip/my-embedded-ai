import { User, Bot, File, FileText, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

type FileAttachment = {
  name: string;
  type: string;
  data: string;
  size: number;
};

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  files?: FileAttachment[];
}

export const ChatMessage = ({ role, content, files }: ChatMessageProps) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="w-4 h-4" />;
    if (type.startsWith('text/') || type.includes('pdf') || type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300",
        role === "user" 
          ? "bg-primary/5 ml-auto max-w-[80%]" 
          : "bg-card border max-w-[90%]"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
          role === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-basketball-orange text-white"
        )}
      >
        {role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div className="flex-1 space-y-2 pt-1">
        <p className="text-sm font-medium text-foreground/80">
          {role === "user" ? "You" : "Basketball Rules Assistant"}
        </p>
        {files && files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((file, idx) => (
              file.type.startsWith('image/') ? (
                <img 
                  key={idx} 
                  src={file.data} 
                  alt={file.name} 
                  className="max-w-xs rounded-lg border border-border"
                />
              ) : (
                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border">
                  {getFileIcon(file.type)}
                  <span className="text-xs">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</span>
                </div>
              )
            ))}
          </div>
        )}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
