
import { GoogleGenAI } from "@google/genai";
import { ScanningData, OrderMaster } from "../types";

export const getProductionInsights = async (scanData: ScanningData[], orders: OrderMaster[]) => {
  // Always use the direct constructor pattern with the API key from process.env
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const dataSummary = `
    Current Scans: ${JSON.stringify(scanData.slice(-20))}
    Total Orders: ${orders.length}
    Unique Styles: ${Array.from(new Set(orders.map(o => o.style))).join(', ')}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this garment production scanning data and provide a short summary of status and any potential bottlenecks. Data: ${dataSummary}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "No insights available at the moment.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to fetch AI insights. Check your API configuration.";
  }
};
