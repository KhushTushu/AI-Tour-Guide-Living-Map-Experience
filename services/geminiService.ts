
import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getTourGuideResponse = async (prompt: string, chatHistory: any[] = []) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: chatHistory.length > 0 ? chatHistory : prompt,
      config: {
        systemInstruction: `You are Vagabond, an enthusiastic and knowledgeable world-class AI Tour Guide. 
        Your tone is adventurous, helpful, and charming. 
        When asked about locations, provide fun facts, local delicacies, and cultural etiquette. 
        Keep your responses concise but immersive. Use markdown for formatting. 
        If the user asks for a recommendation, give them one specific amazing place from around the world.`,
      },
    });
    return response.text || "I'm sorry, I seem to have lost my map! Can you repeat that?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I hit a bit of a roadblock on our journey. Let's try again!";
  }
};

export const generateItinerary = async (destination: string): Promise<Itinerary | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a 3-day itinerary for ${destination}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            destination: { type: Type.STRING },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["day", "title", "activities"]
              }
            }
          },
          required: ["destination", "days"]
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as Itinerary;
  } catch (error) {
    console.error("Itinerary Error:", error);
    return null;
  }
};
