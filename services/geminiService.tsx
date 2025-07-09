import { GoogleGenerativeAI, Part } from "@google/generative-ai"; // <-- THE CORRECT, HYPHENATED NAME IS HERE

// This securely reads the API key from your .env.local file.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set. Please create a .env.local file and add it.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const generateText = async (
  prompt: string,
  systemInstruction?: string,
  modelName: string = 'gemini-1.5-flash-latest'
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API (generateText) error:", error);
    throw new Error(error.message || "An unknown error occurred while generating text.");
  }
};

export const generateTextAndImage = async (
  prompt: string,
  imageBase64: string,
  mimeType: string,
  systemInstruction?: string,
  modelName: string = 'gemini-1.5-flash-latest'
): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: modelName, systemInstruction });
    const imagePart: Part = { inlineData: { data: imageBase64, mimeType } };
    const textPart: Part = { text: prompt };
    
    const result = await model.generateContent([textPart, imagePart]);
    const response = await result.response;
    return response.text();
  } catch (error: any)
  {
    console.error("Gemini API (generateTextAndImage) error:", error);
    throw new Error(error.message || "An unknown error occurred while processing the image.");
  }
};