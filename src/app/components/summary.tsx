import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PrismaClient } from '@prisma/client'
import { TextToSpeech } from './text-to-speech'
import { KeyPhrasesExtractor } from './key-phrase-extractor'
import { SentimentAnalysis } from './sentiment-analysis'

const prisma = new PrismaClient()

export default async function Summary() {
  let summaries: any[] = [];
  try {
    summaries = await prisma.content.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        summary: true,
      },
    });
  } catch (error) {
    console.error('Error fetching summaries:', error);
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Recent Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          {summaries.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {summaries.map((content, index) => (
                <AccordionItem key={content.id} value={`item-${index}`}>
                  <AccordionTrigger>
                    Summary from {content.createdAt.toLocaleString()}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Original Text:</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{content.text}</p>
                      </div>
                      {content.summary && (
                        <div>
                          <h4 className="font-medium mb-2">Summary:</h4>
                          <p className="text-sm">{content.summary.summary}</p>
                          <TextToSpeech text={content.summary.summary} />
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p>No summaries available yet.</p>
          )}
        </CardContent>
      </Card>
      {summaries.length > 0 && summaries[0]?.summary && (
        <>
          <KeyPhrasesExtractor text={summaries[0].summary.summary} />
          <SentimentAnalysis text={summaries[0].summary.summary} />
        </>
      )}
    </>
  )
}

