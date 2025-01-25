import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const MEANING_CLOUD_API_URL = 'https://api.meaningcloud.com/summarization-1.0';
const MEANING_CLOUD_API_KEY = process.env.MEANING_CLOUD_API_KEY;

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const text = formData.get('text') as string | null;
    const file = formData.get('file') as File | null;

    let content = text || '';

    if (file) {
      const buffer = await file.arrayBuffer();
      content = Buffer.from(buffer).toString('utf-8');
    }

    if (!content) {
      return NextResponse.json({ error: 'No content provided' }, { status: 400 });
    }

    const apiFormData = new URLSearchParams();
    apiFormData.append('key', MEANING_CLOUD_API_KEY || '');
    apiFormData.append('txt', content);
    apiFormData.append('sentences', '5');

    const response = await fetch(MEANING_CLOUD_API_URL, {
      method: 'POST',
      body: apiFormData,
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.status.code !== '0') {
      throw new Error(`API error: ${result.status.msg}`);
    }

    const summary = result.summary;

    // Save content and summary to the database
    await prisma.content.create({
      data: {
        text: content,
        summary: {
          create: {
            summary: summary,
          },
        },
      },
    });

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in summarize function:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

