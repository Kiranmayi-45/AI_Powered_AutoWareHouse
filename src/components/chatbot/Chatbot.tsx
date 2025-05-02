import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MessageSquare, X } from 'lucide-react';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 sm:w-96 h-[500px] overflow-hidden flex flex-col shadow-xl animate-fade-in">
        <div className="flex items-center justify-between bg-primary text-primary-foreground p-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <span className="font-medium">AutoWare Assistant</span>
          </div>
          <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)} className="h-7 w-7 rounded-full hover:bg-primary-foreground/10">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden bg-muted/30">
          <iframe
            src="https://cdn.botpress.cloud/webchat/v2.4/shareable.html?configUrl=https://files.bpcontent.cloud/2025/04/25/17/20250425172906-7FXLAPY9.json"
            title="AutoWare Chatbot"
            className="w-full h-full border-0"
            allow="clipboard-write; microphone"
          />
        </div>
      </Card>
    </div>
  );
};

export default Chatbot;