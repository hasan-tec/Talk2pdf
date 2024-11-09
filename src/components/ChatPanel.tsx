import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { askQuestion } from '../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatPanelProps {
  pdfContent: string | null;
}

export default function ChatPanel({ pdfContent }: ChatPanelProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
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
      <div className="p-4 border-b border-[#2A2A2A] bg-[#1A1A1A]">
        <h2 className="text-lg font-semibold text-white">Chat</h2>
        <p className="text-sm text-gray-400">Ask questions about your PDF document</p>
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
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#1A1A1A] text-gray-300 border border-[#2A2A2A]'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-[#2A2A2A] p-4 flex gap-2 items-center bg-[#1A1A1A]"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={pdfContent ? "Ask a question about the PDF..." : "Upload a PDF first"}
          disabled={!pdfContent || isLoading}
          className="flex-1 px-4 py-2 bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg text-white placeholder-gray-400 
            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
            disabled:bg-[#1A1A1A] disabled:text-gray-500"
        />
        <button
          type="submit"
          disabled={!pdfContent || isLoading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 
            disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
}