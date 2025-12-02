import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from environment variables
// The prompt specifies to assume process.env.API_KEY is valid and available.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates text content using the Gemini Flash model.
 * Ideal for quick responses and general queries.
 */
export const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Access the text property directly as per @google/genai guidelines
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
