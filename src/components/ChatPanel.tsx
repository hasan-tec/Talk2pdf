import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Home } from 'lucide-react';
import { askQuestion } from '../lib/gemini';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  pdfContent: string | null;
  onHome: () => void;
}

export default function ChatPanel({ pdfContent, onHome }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !pdfContent) return;

    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);

    try {
      const answer = await askQuestion(question, pdfContent);
      setMessages(prev => [...prev, { role: 'assistant', content: answer }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, I encountered an error processing your question.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-white">
      <div className="p-4 border-b border-[#2A2A2A] bg-[#1A1A1A] flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">Chat</h2>
          <p className="text-sm text-gray-400">Ask questions about your PDF document</p>
        </div>
        <Button variant="ghost" onClick={onHome}>
          <Home className="h-5 w-5" />
        </Button>
      </div>

      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            Your conversation will appear here
          </div>
        ) : (
          messages.map((message, index) => (
            <Card
              key={index}
              className={`max-w-[80%] ${
                message.role === 'user' ? 'ml-auto bg-blue-600' : 'mr-auto bg-[#1A1A1A] border-[#2A2A2A]'
              }`}
            >
              <CardContent className="p-3">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <span className="font-bold">{children}</span>,
                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                    li: ({ children }) => <li className="mb-1">{children}</li>,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-[#2A2A2A] p-4 bg-[#1A1A1A]"
      >
        <div className="flex gap-2">
          <Input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={pdfContent ? "Ask a question about the PDF..." : "Upload a PDF first"}
            disabled={!pdfContent || isLoading}
            className="flex-1 bg-[#0A0A0A] border-[#2A2A2A] text-white placeholder-gray-400 
              focus:ring-2 focus:ring-blue-600 focus:border-transparent
              disabled:bg-[#1A1A1A] disabled:text-gray-500"
          />
          <Button
            type="submit"
            disabled={!pdfContent || isLoading}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 
              disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}