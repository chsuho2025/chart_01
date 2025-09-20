import { GoogleGenAI, Type } from "@google/genai";
import type { Song } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const musicChartSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      rank: {
        type: Type.INTEGER,
        description: "The song's current rank on the chart (1-20)."
      },
      title: {
        type: Type.STRING,
        description: "The title of the song."
      },
      artist: {
        type: Type.STRING,
        description: "The artist(s) of the song."
      },
      isRising: {
        type: Type.BOOLEAN,
        description: "True if the song is seeing a rapid surge in popularity."
      },
      rankHistory: {
        type: Type.ARRAY,
        description: "An array of the song's rank for the last 7 days, including today. The most recent day should be first.",
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING, description: "Date in YYYY-MM-DD format." },
            rank: { type: Type.INTEGER, description: "The rank on that date." },
          },
          required: ["date", "rank"]
        }
      },
       youtubeUrl: {
        type: Type.STRING,
        description: "A valid YouTube search URL for the song's official music video."
      }
    },
    required: ["rank", "title", "artist", "isRising", "rankHistory", "youtubeUrl"]
  }
};

export const fetchKoreanMusicChart = async (): Promise<Song[]> => {
  const requestedDate = '2025-09-20';
  const prompt = `
    Act as a music data analyst for "TREND REPUBLIC," a service that captures the real-time music pulse of South Korean youth.
    Your task is to generate today's top 20 song chart, reflecting the data as of 8 AM KST on ${requestedDate}.

    Your analysis must be based *exclusively* on the following two sources of short-form content virality:
    1.  YouTube Music Shorts Chart (South Korea)
    2.  Instagram Reels Trending Audio (South Korea)

    Apply the "Republic Index": Your ranking algorithm must prioritize songs that are simultaneously trending or rapidly growing on BOTH platforms. A song's virality in short-form video content is the most critical factor. Give less weight to traditional streaming numbers.

    For each of the 20 songs, you must provide:
    1.  'rank': The final synthesized rank for today.
    2.  'title' and 'artist': Accurate song information.
    3.  'isRising': Set to 'true' for songs showing explosive growth on both YouTube Shorts and Instagram Reels in the last 24-48 hours.
    4.  'rankHistory': Provide the daily rank for the past 7 days, ending with today's date (${requestedDate}). The array must contain exactly 7 entries. If a song was not on the chart on a past day, its rank must be greater than 20 (e.g., 25, 40) or 0 to indicate it was unranked.
    5.  'youtubeUrl': A direct YouTube search query link for the song's official music video. (e.g., https://www.youtube.com/results?search_query=artist+title+MV)

    The output must be a JSON array of 20 song objects, strictly adhering to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: musicChartSchema,
      },
    });

    const jsonText = response.text.trim();
    const chartData = JSON.parse(jsonText);
    
    if (!Array.isArray(chartData) || chartData.length === 0) {
        throw new Error("API returned invalid or empty chart data.");
    }

    return chartData as Song[];
  } catch (error) {
    console.error("Error fetching or parsing music chart data:", error);
    throw new Error("Failed to generate the music chart. The AI model might be unavailable or returned an unexpected format.");
  }
};