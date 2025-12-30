import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Transaction } from '../types';

interface AIInsightsProps {
  transactions: Transaction[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ transactions }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAISummary = async () => {
    // FIX: Per coding guidelines, the API key is assumed to be available and should not be checked for explicitly.
    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      // FIX: The API key must be obtained exclusively from `process.env.API_KEY`.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a financial assistant. Based on this JSON data of my recent transactions, provide a short, bulleted summary (3-4 points) of my spending habits and one actionable insight. Address me directly. Data: ${JSON.stringify(transactions.slice(0, 20))}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setSummary(response.text);
    } catch (err) {
      console.error("Gemini API Error:", err);
      // FIX: Use a generic error message that does not mention API keys.
      setError("Could not get AI summary. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-gray-700 px-2 mb-3">AI Insights</h3>
      <div className="p-5 rounded-2xl bg-[#efeeee] shadow-[5px_5px_10px_#d1d1d1,-5px_-5px_10px_#ffffff]">
        <div className="text-sm text-gray-700 min-h-[60px]">
          {isLoading && <p className="text-center text-gray-500">Generating summary...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {summary && <div className="whitespace-pre-wrap">{summary}</div>}
          {!isLoading && !error && !summary && <p className="text-xs text-gray-500">Get a quick analysis of your spending habits from our AI assistant.</p>}
        </div>
        <button 
          onClick={getAISummary}
          disabled={isLoading}
          className="mt-4 w-full py-2 rounded-lg bg-[#efeeee] text-blue-500 font-bold text-sm shadow-[3px_3px_6px_#c5c5c5,-3px_-3px_6px_#ffffff] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
          {isLoading ? 'Analyzing...' : 'Get AI Summary'}
        </button>
      </div>
    </div>
  );
};

export default AIInsights;