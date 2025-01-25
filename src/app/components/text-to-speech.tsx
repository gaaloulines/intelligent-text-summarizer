'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX } from 'lucide-react'

interface TextToSpeechProps {
  text: string
}

export function TextToSpeech({ text }: TextToSpeechProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speech, setSpeech] = useState<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    const newSpeech = new SpeechSynthesisUtterance(text)
    setSpeech(newSpeech)

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [text])

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
    } else {
      const utterance = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(utterance)
    }
    setIsSpeaking(!isSpeaking)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSpeak}
      className="mt-2"
    >
      {isSpeaking ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
      {isSpeaking ? 'Stop' : 'Listen'}
    </Button>
  )
}

