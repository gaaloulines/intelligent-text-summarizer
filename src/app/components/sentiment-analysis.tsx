'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Sentiment from 'sentiment';

interface SentimentAnalysisProps {
  text: string;
}

export function SentimentAnalysis({ text }: SentimentAnalysisProps) {
  const [sentiment, setSentiment] = useState<{ score: number; comparative: number }>({ score: 0, comparative: 0 });

  useEffect(() => {
    if (!text) {
      setSentiment({ score: 0, comparative: 0 });
      return;
    }

    const analyzer = new Sentiment();
    const result = analyzer.analyze(text);
    setSentiment({ score: result.score, comparative: result.comparative });
  }, [text]);

  const getSentimentLabel = (score: number) => {
    if (score > 0) return 'Positive';
    if (score < 0) return 'Negative';
    return 'Neutral';
  };

  const getProgressValue = (comparative: number) => {
    // Normalize the comparative score to a 0-100 range
    return Math.min(Math.max((comparative + 5) * 10, 0), 100);
  };

  if (!text) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Overall Sentiment:</p>
            <p className="text-2xl font-bold">{getSentimentLabel(sentiment.score)}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Sentiment Score:</p>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${getProgressValue(sentiment.comparative)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Very Negative</span>
              <span>Neutral</span>
              <span>Very Positive</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
