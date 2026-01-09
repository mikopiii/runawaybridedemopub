import { GoogleGenAI } from "@google/genai";

const MANTRA = "A marriage full of mystery, thoughts fogged up by misery.";

export interface WhisperResult {
  text: string;
  isError: boolean;
  errorType?: 'QUOTA' | 'OTHER';
}

export const getWhisper = async (): Promise<WhisperResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Generate one unsettling 12-word sentence involving rotting lace, cold floorboards, or shattered mirrors.",
      config: {
        systemInstruction: "You are the haunting subconscious of a bride who died at the altar. Your whispers are cryptic, visceral, and terrifying. Your primary mantra is 'A marriage full of mystery, thoughts fogged up by misery'.",
        temperature: 1,
        topP: 0.95,
        topK: 64,
      },
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty response");
    
    return { text, isError: false };
  } catch (error: any) {
    console.error("Gemini Whisper Error:", error);
    // Check if error is related to quota/rate limiting
    const errorStr = JSON.stringify(error).toLowerCase();
    const isQuota = errorStr.includes('429') || errorStr.includes('quota') || errorStr.includes('resource_exhausted');
    
    return { 
      text: MANTRA, 
      isError: true, 
      errorType: isQuota ? 'QUOTA' : 'OTHER' 
    };
  }
};
