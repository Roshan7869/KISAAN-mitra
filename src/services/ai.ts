import { GoogleGenerativeAI } from '@google/generative-ai';
import { getApiKey } from './storage';

const SYSTEM_PROMPT = `You are Kisaan Mitra AI, helping farmers with technical queries. Keep responses:
1. Focused on the specific question asked
2. Brief and direct
3. In the same language as the query
4. Without unnecessary context or symbols
5. With practical, actionable advice`;

export async function generateResponse(prompt: string, image?: File): Promise<string> {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    if (!prompt.trim() && !image) {
      throw new Error('Please provide a question or upload an image');
    }

    const parts: any[] = [{ text: SYSTEM_PROMPT }, { text: prompt }];

    if (image) {
      const imageData = await fileToGenerativePart(image);
      parts.push(imageData);
    }

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
    });
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Generation Error:', error);
    if (error instanceof Error) {
      throw new Error(`AI Error: ${error.message}`);
    }
    throw new Error('Failed to generate response. Please try again.');
  }
}

async function fileToGenerativePart(file: File) {
  const data = await fileToBase64(file);
  return {
    inlineData: {
      mimeType: file.type,
      data
    }
  };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}