import { GoogleGenAI } from '@google/genai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type ReplyMode = 'concise' | 'polite' | 'apology';
export type Language = 'ja' | 'en' | 'zh';

interface GenerateReplyParams {
  customerEmail: string;
  companyName?: string;
  senderName?: string;
  notes?: string;
  mode: ReplyMode;
  language: Language;
}

export async function generateReply({
  customerEmail,
  companyName,
  senderName,
  notes,
  mode,
  language,
}: GenerateReplyParams): Promise<string> {
  const model = 'gemini-2.0-flash';

  const modeInstructions = {
    concise:
      'Keep the reply short, direct, and efficient. Focus on the key information.',
    polite:
      'Use very polite and professional language. Ensure the customer feels valued and respected.',
    apology:
      'Focus on expressing sincere apology for any inconvenience. Be empathetic and offer a clear resolution or next steps.',
  };

  const languageNames = {
    ja: 'Japanese',
    en: 'English',
    zh: 'Chinese (Simplified)',
  };

  const systemInstruction = `
    You are a professional business assistant specializing in customer support email replies.
    Your task is to generate a reply to a customer email.

    Target Language: ${languageNames[language]}
    Reply Mode: ${modeInstructions[mode]}

    Context:
    - Company Name: ${companyName || 'Not specified'}
    - Sender Name: ${senderName || 'Not specified'}
    - Additional Notes/Instructions: ${notes || 'None'}

    Guidelines:
    1. If Company Name or Sender Name is provided, include them appropriately in the signature or header.
    2. The reply must be written entirely in ${languageNames[language]}.
    3. Maintain a professional tone suitable for business correspondence.
    4. Address the points raised in the customer's email.
    5. Incorporate any specific instructions provided in the "Additional Notes/Instructions" section.
    6. Do not include any placeholder text like "[Your Name]" if the name is provided.
    7. Output ONLY the email content. No preamble or explanation.
  `;

  const prompt = `
    Customer Email:
    """
    ${customerEmail}
    """

    Please generate the reply now.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || 'Failed to generate reply.';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('AI generation failed. Please try again.');
  }
}
