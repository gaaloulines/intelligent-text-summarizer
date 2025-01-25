'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KeyPhrasesExtractorProps {
  text: string
}

export function KeyPhrasesExtractor({ text }: KeyPhrasesExtractorProps) {
  const [keyPhrases, setKeyPhrases] = useState<string[]>([])

  useEffect(() => {
    if (!text) {
      setKeyPhrases([])
      return
    }

    // Simple key phrase extraction algorithm
    const words = text.toLowerCase().split(/\s+/)
    const wordFrequency: Record<string, number> = {}
    const phrases: Record<string, number> = {}

    // Count word frequency
    words.forEach(word => {
      if (word.length > 3) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1
      }
    })

    // Extract phrases (2-3 word combinations)
    for (let i = 0; i < words.length - 1; i++) {
      if (words[i].length > 3 && words[i + 1].length > 3) {
        const phrase = `${words[i]} ${words[i + 1]}`
        phrases[phrase] = (phrases[phrase] || 0) + 1
      }
      if (i < words.length - 2 && words[i].length > 3 && words[i + 1].length > 3 && words[i + 2].length > 3) {
        const phrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
        phrases[phrase] = (phrases[phrase] || 0) + 1
      }
    }

    // Combine single words and phrases, sort by frequency
    const combined = [...Object.entries(wordFrequency), ...Object.entries(phrases)]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([phrase]) => phrase)

    setKeyPhrases(combined)
  }, [text])

  if (!text || keyPhrases.length === 0) {
    return null
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Key Phrases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {keyPhrases.map((phrase, index) => (
            <Badge key={index} variant="secondary">
              {phrase}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

