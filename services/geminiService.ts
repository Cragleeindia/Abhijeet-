import { GoogleGenAI, Type } from "@google/genai";
import type { VideoTemplate } from '../types';

// FIX: Updated API key initialization to align with @google/genai guidelines, removing fallback logic and assuming `process.env.API_KEY` is always provided.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        shots: {
            type: Type.ARRAY,
            description: "An array of shot objects representing the video timeline.",
            items: {
                type: Type.OBJECT,
                properties: {
                    duration: {
                        type: Type.NUMBER,
                        description: "Duration of the shot in seconds (e.g., 1.2)."
                    },
                    description: {
                        type: Type.STRING,
                        description: "A descriptive placeholder for the shot content (e.g., 'Dynamic close-up of product')."
                    },
                    transition: {
                        type: Type.STRING,
                        description: "The transition effect leading into this shot (e.g., 'Hard Cut', 'Zoom In')."
                    },
                    effect: {
                        type: Type.STRING,
                        description: "A visual effect applied to the shot (e.g., 'None', 'Glitch', 'Slow Motion')."
                    },
                    caption: {
                        type: Type.STRING,
                        description: "On-screen text for this shot. Can be an empty string."
                    }
                },
                required: ["duration", "description", "transition", "effect", "caption"]
            }
        }
    },
    required: ["shots"]
};

export const generateTemplateFromPrompt = async (): Promise<VideoTemplate> => {
  try {
    const prompt = `You are an expert video editor AI. Analyze the structure of a popular 15-second social media reel. Your task is to generate a JSON object representing a video template.

Create a template with 8 to 12 shots. The total duration should be between 12 and 18 seconds. The shot descriptions should be varied and inspiring for a content creator. The captions should form a cohesive, short story or message. Make it feel like a real, trendy reel structure.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);

    let totalDuration = 0;
    const shotsWithIds = parsedJson.shots.map((shot: any, index: number) => {
      totalDuration += shot.duration;
      return { ...shot, id: `shot-${index}-${Date.now()}` };
    });

    return {
      shots: shotsWithIds,
      totalDuration: parseFloat(totalDuration.toFixed(2)),
    };
  } catch (error) {
    console.error("Error generating template from Gemini:", error);
    throw new Error("Failed to communicate with the AI to generate a template.");
  }
};
