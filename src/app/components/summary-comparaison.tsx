'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

interface Summary {
  id: string;
  summary: string;
  createdAt: string;
}

interface SummaryComparisonProps {
  summaries: Summary[];
}

export function SummaryComparison({ summaries }: SummaryComparisonProps) {
  const [leftSummary, setLeftSummary] = useState<Summary | null>(null)
  const [rightSummary, setRightSummary] = useState<Summary | null>(null)

  if (!summaries || summaries.length === 0) {
    return null
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Comparer les résumés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Select onValueChange={(value) => setLeftSummary(summaries.find(s => s.id === value) || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un résumé" />
              </SelectTrigger>
              <SelectContent>
                {summaries.map((summary) => (
                  <SelectItem key={summary.id} value={summary.id}>
                    {new Date(summary.createdAt).toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {leftSummary && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Résumé :</h4>
                <p className="text-sm">{leftSummary.summary}</p>
              </div>
            )}
          </div>
          <div>
            <Select onValueChange={(value) => setRightSummary(summaries.find(s => s.id === value) || null)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un résumé" />
              </SelectTrigger>
              <SelectContent>
                {summaries.map((summary) => (
                  <SelectItem key={summary.id} value={summary.id}>
                    {new Date(summary.createdAt).toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rightSummary && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Résumé :</h4>
                <p className="text-sm">{rightSummary.summary}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

