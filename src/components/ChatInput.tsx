import { useState, useRef } from "react";
import { Send, Paperclip, X, File, FileText, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type FileAttachment = {
  name: string;
  type: string;
  data: string;
  size: number;
};

interface ChatInputProps {
  onSend: (message: string, files?: FileAttachment[]) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((input.trim() || files.length > 0) && !disabled) {
      onSend(input.trim(), files);
      setInput("");
      setFiles([]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB limit
    
    const filePromises = Array.from(selectedFiles).map(file => {
      return new Promise<FileAttachment | null>((resolve) => {
        if (file.size > MAX_FILE_SIZE) {
          resolve(null);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            name: file.name,
            type: file.type,
            data: e.target?.result as string,
            size: file.size
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const fileResults = await Promise.all(filePromises);
    const validFiles = fileResults.filter((f): f is FileAttachment => f !== null);
    setFiles(prev => [...prev, ...validFiles]);
    
    if (fileResults.some(f => f === null)) {
      // Could show toast for files that were too large
      console.warn("Some files exceeded 20MB size limit");
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="w-4 h-4" />;
    if (type.startsWith('text/') || type.includes('pdf') || type.includes('document')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith('image/') ? (
                <div className="relative">
                  <img 
                    src={file.data} 
                    alt={file.name} 
                    className="w-20 h-20 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg border border-border max-w-[200px]">
                  {getFileIcon(file.type)}
                  <span className="text-xs truncate flex-1">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about basketball rules... (e.g., 'What is traveling?' or 'Explain the 24-second shot clock')"
          disabled={disabled}
          className="pr-20 min-h-[60px] max-h-[200px] resize-none bg-background border-border focus-visible:ring-primary"
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="absolute right-2 bottom-2 flex gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            type="submit"
            size="icon"
            disabled={(!input.trim() && files.length === 0) || disabled}
            className="h-8 w-8 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </form>
  );
};
