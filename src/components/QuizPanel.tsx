import  { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Loader2, Home, Check, X } from 'lucide-react';
import { askQuestion } from '../lib/gemini';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface QuizPanelProps {
  pdfContent: string | null;
  onExit: () => void;
}

interface Flashcard {
  question: string;
  answer: string;
}

interface QuizResults {
  known: number;
  unknown: number;
  total: number;
}

export default function QuizPanel({ pdfContent, onExit }: QuizPanelProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QuizResults>({ known: 0, unknown: 0, total: 0 });
  const [quizComplete, setQuizComplete] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (pdfContent) {
      generateQuiz();
    } else {
      setError("No PDF content provided");
      setIsLoading(false);
    }
  }, [pdfContent]);

  const generateQuiz = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const quizPrompt = `Based on the following PDF content, generate 5 quiz questions with their answers. Format the response as a JSON array of objects, each with 'question' and 'answer' properties:

      ${pdfContent}`;

      const quizResponse = await askQuestion(quizPrompt, pdfContent || '');
      const jsonMatch = quizResponse.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
        throw new Error('Invalid quiz response format');
      }

      const parsedQuiz = JSON.parse(jsonMatch[0]);
      
      // Validate the parsed quiz data
      if (!Array.isArray(parsedQuiz) || parsedQuiz.length === 0) {
        throw new Error('Quiz generation failed: No questions received');
      }

      const validQuiz = parsedQuiz.every(card => 
        card && typeof card.question === 'string' && 
        typeof card.answer === 'string'
      );

      if (!validQuiz) {
        throw new Error('Quiz generation failed: Invalid question format');
      }

      setFlashcards(parsedQuiz);
      setResults({ known: 0, unknown: 0, total: parsedQuiz.length });
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipe = info.offset.x;
    const swipeThreshold = 150;

    if (Math.abs(swipe) > swipeThreshold) {
      if (swipe > 0) {
        handleSwipe('right');
        setDirection('right');
      } else {
        handleSwipe('left');
        setDirection('left');
      }
    }
  };

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      setResults(prev => ({ ...prev, known: prev.known + 1 }));
    } else {
      setResults(prev => ({ ...prev, unknown: prev.unknown + 1 }));
    }
    
    setTimeout(() => {
      if (currentCardIndex === flashcards.length - 1) {
        setQuizComplete(true);
      } else {
        setCurrentCardIndex(prev => prev + 1);
        setShowAnswer(false);
        setDirection(null);
      }
    }, 200);
  };

  const restartQuiz = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setQuizComplete(false);
    setResults({ known: 0, unknown: 0, total: flashcards.length });
    setDirection(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Generating quiz...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-lg text-red-500">{error}</p>
        <Button onClick={() => generateQuiz()} variant="default">
          Try Again
        </Button>
        <Button onClick={onExit} variant="outline">
          Exit
        </Button>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-lg">No questions available. Please try again.</p>
        <Button onClick={() => generateQuiz()} variant="default">
          Generate Quiz
        </Button>
        <Button onClick={onExit} variant="outline">
          Exit
        </Button>
      </div>
    );
  }

  if (quizComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Quiz Results</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span>Correct Answers:</span>
                <span className="font-bold text-green-500">{results.known}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Incorrect Answers:</span>
                <span className="font-bold text-red-500">{results.unknown}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Score:</span>
                <span className="font-bold">
                  {Math.round((results.known / results.total) * 100)}%
                </span>
              </div>
            </div>
            <div className="flex space-x-4">
              <Button onClick={restartQuiz} variant="default" className="flex-1">
                Try Again
              </Button>
              <Button onClick={onExit} variant="outline" className="flex-1">
                <Home className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCard = flashcards[currentCardIndex];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0A0A] p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Question {currentCardIndex + 1} of {flashcards.length}</h2>
          <Button variant="ghost" onClick={onExit}>
            <Home className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="relative h-[400px]">
          <AnimatePresence>
            <motion.div
              key={currentCardIndex}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="absolute w-full"
            >
              <Card className="w-full">
                <CardContent className="p-6">
                  <div className="text-lg font-semibold mb-4">
                    {showAnswer ? 'Answer:' : 'Question:'}
                  </div>
                  <p className="text-xl mb-6">
                    {showAnswer ? currentCard.answer : currentCard.question}
                  </p>
                  <Button 
                    onClick={() => setShowAnswer(!showAnswer)}
                    variant="outline"
                    className="w-full"
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <Button
            variant="destructive"
            onClick={() => handleSwipe('left')}
            className="flex-1 max-w-[160px]"
          >
            <X className="mr-2 h-4 w-4" />
            Don't Know
          </Button>
          <Button
            variant="default"
            onClick={() => handleSwipe('right')}
            className="flex-1 max-w-[160px]"
          >
            <Check className="mr-2 h-4 w-4" />
            Know
          </Button>
        </div>
      </div>
    </div>
  );
}