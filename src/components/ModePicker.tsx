
import { BookOpen, Brain } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface ModePickerProps {
  onModeSelect: (mode: 'chat' | 'quiz') => void;
}

export default function ModePicker({ onModeSelect }: ModePickerProps) {
  return (
    <div className="h-full flex items-center justify-center">
      <Card className="w-full max-w-2xl bg-[#1A1A1A] border-[#2A2A2A]">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center mb-8">Choose Your Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              onClick={() => onModeSelect('chat')}
              variant="outline"
              className="h-40 flex flex-col items-center justify-center space-y-4 hover:bg-blue-500/10"
            >
              <BookOpen className="h-12 w-12" />
              <div>
                <p className="font-semibold text-lg">Chat Mode</p>
                <p className="text-sm text-gray-400">Ask questions about your PDF</p>
              </div>
            </Button>
            <Button
              onClick={() => onModeSelect('quiz')}
              variant="outline"
              className="h-40 flex flex-col items-center justify-center space-y-4 hover:bg-green-500/10"
            >
              <Brain className="h-12 w-12" />
              <div>
                <p className="font-semibold text-lg">Quiz Mode</p>
                <p className="text-sm text-gray-400">Test your knowledge</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}