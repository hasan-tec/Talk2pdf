"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { askQuestion } from '../lib/gemini'

interface QuizPanelProps {
  pdfContent: string | null
}

interface Flashcard {
  question: string
  answer: string
}

export default function QuizPanel({ pdfContent }: QuizPanelProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pdfContent) {
      generateQuiz()
    }
  }, [pdfContent])

  const generateQuiz = async () => {
    setIsLoading(true);
    try {
      const quizPrompt = `Based on the following PDF content, generate 5 quiz questions with their answers. Format the response as a JSON array of objects, each with 'question' and 'answer' properties:

      ${pdfContent}

      Example format:
      [
        {
          "question": "What is the capital of France?",
          "answer": "Paris"
        },
        ...
      ]`

      const quizResponse = await askQuestion(quizPrompt, pdfContent || '');

      // Clean up the response to extract only the JSON part
      const jsonMatch = quizResponse.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid quiz response format');
      }

      const cleanedResponse = jsonMatch[0];
      const parsedQuiz = JSON.parse(cleanedResponse);
      setFlashcards(parsedQuiz);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setFlashcards([]);  // Set empty array in case of error
      setError('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      // User knows the answer
      console.log('User knows the answer')
    } else {
      // User doesn't know the answer
      console.log("User doesn't know the answer")
    }
    nextCard()
  }

  const nextCard = () => {
    setShowAnswer(false)
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length)
  }

  const prevCard = () => {
    setShowAnswer(false)
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Generating quiz...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">No flashcards available. Please upload a PDF first.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-2xl font-bold mb-4">PDF Quiz</h2>
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-lg font-semibold mb-4">
              {showAnswer ? 'Answer:' : 'Question:'}
            </div>
            <p className="text-xl mb-6">
              {showAnswer
                ? flashcards[currentCardIndex].answer
                : flashcards[currentCardIndex].question}
            </p>
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={prevCard}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? 'Hide Answer' : 'Show Answer'}
              </Button>
              <Button variant="outline" onClick={nextCard}>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <Button
          variant="destructive"
          onClick={() => handleSwipe('left')}
          className="px-8 py-2"
        >
          Don't Know
        </Button>
        <Button
          variant="default"
          onClick={() => handleSwipe('right')}
          className="px-8 py-2"
        >
          Know
        </Button>
      </div>
    </div>
  )
}