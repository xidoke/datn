import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const aiService = {
  async generateDescription(description: string): Promise<string> {
    if (!description) {
      throw new Error('Prompt is required');
    }

    try {
      const task = "Generate a detailed description for the following issue:";
      const finalText = `${task}\n${description}`;

      const result = await model.generateContent(finalText);
      const response = await result.response;
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error generating description:', error);
      throw error;
    }
  },
};
