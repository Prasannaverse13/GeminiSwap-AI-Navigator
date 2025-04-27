import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { geminiRequestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Gemini API analysis endpoint
  app.post("/api/gemini/analyze", async (req, res) => {
    try {
      // Validate the request body
      const validatedData = geminiRequestSchema.parse(req.body);
      
      // Build the prompt for Gemini
      const prompt = `
        You are GeminiSwap AI Navigator, a DeFi trading assistant.
        
        Analyze the following swap request:
        - From Token: ${validatedData.fromToken}
        - To Token: ${validatedData.toToken}
        - Amount: ${validatedData.amount}
        - Slippage Tolerance: ${validatedData.slippageTolerance || 0.5}%
        - Risk Profile: ${validatedData.riskProfile || "balanced"}
        
        Based on current market conditions on Rootstock, provide:
        1. A brief summary of the swap (1-2 sentences)
        2. 2-3 insights about this swap
        3. 3 recommended swap routes with the following details for each:
           - Provider name
           - Route type (direct or multi-hop)
           - Path of tokens
           - Expected output amount
           - Gas estimate
           - Slippage estimate
           - Improvement percentage vs market average
        4. A market condition statement about the current price trends

        Format your response as JSON with the following structure:
        {
          "summary": "Summary text here",
          "insights": ["Insight 1", "Insight 2", ...],
          "recommendedRoutes": [
            {
              "provider": "Provider name",
              "routeType": "Direct swap or Multi-hop",
              "path": ["TokenA", "TokenB"],
              "output": {
                "amount": "123.45",
                "token": "TokenB"
              },
              "gas": {
                "amount": "0.0001",
                "token": "RBTC"
              },
              "slippage": 0.05,
              "improvement": 1.2,
              "isRecommended": true
            },
            ...
          ],
          "marketConditions": "Market condition statement"
        }
        
        Mark the best route with "isRecommended": true.
      `;

      // Call the Gemini API
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [{
            parts: [{ text: prompt }]
          }]
        },
        {
          params: {
            key: process.env.GEMINI_API_KEY || "AIzaSyBxdNfAxjzBsqS_lrCiux3XvrNB6K86dvc"
          },
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      // Extract the text response from Gemini
      const geminiTextResponse = response.data.candidates[0].content.parts[0].text;
      
      // Find the JSON part of the response
      const jsonStartIndex = geminiTextResponse.indexOf('{');
      const jsonEndIndex = geminiTextResponse.lastIndexOf('}') + 1;
      
      if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        throw new Error("Could not extract JSON from Gemini response");
      }
      
      const jsonResponse = geminiTextResponse.substring(jsonStartIndex, jsonEndIndex);
      const analysisData = JSON.parse(jsonResponse);
      
      // Store the AI analysis
      await storage.createAIAnalysis({
        fromTokenId: 1, // Simplified for demo
        toTokenId: 2, // Simplified for demo
        amount: validatedData.amount,
        summary: analysisData.summary,
        insights: analysisData.insights,
        marketConditions: analysisData.marketConditions,
      });

      res.json(analysisData);
    } catch (error) {
      console.error("Error in Gemini analysis:", error);
      res.status(500).json({ 
        error: "Failed to analyze swap",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Swap execution endpoint
  app.post("/api/swap/execute", async (req, res) => {
    try {
      // Validate the request body
      const swapSchema = z.object({
        fromToken: z.string(),
        toToken: z.string(),
        amount: z.string(),
        walletAddress: z.string(),
        slippageTolerance: z.number().optional(),
        deadline: z.number().optional(),
        gasPreference: z.string().optional(),
      });
      
      const validatedData = swapSchema.parse(req.body);

      // In a real implementation, this would interact with a blockchain node
      // to execute the swap or return the transaction data to be signed
      
      // For demo purposes, just simulate success
      res.json({
        success: true,
        txHash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        fromToken: validatedData.fromToken,
        toToken: validatedData.toToken,
        amount: validatedData.amount,
        estimatedOutput: (parseFloat(validatedData.amount) * 27627).toFixed(2), // Simplified calculation
      });
    } catch (error) {
      console.error("Error in swap execution:", error);
      res.status(500).json({ 
        error: "Failed to execute swap",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Token list endpoint
  app.get("/api/tokens", async (req, res) => {
    try {
      const tokens = await storage.getTokens();
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      res.status(500).json({ error: "Failed to fetch tokens" });
    }
  });

  // User settings endpoint
  app.post("/api/settings", async (req, res) => {
    try {
      const settingsSchema = z.object({
        walletAddress: z.string(),
        slippageTolerance: z.number(),
        deadline: z.number(),
        gasPreference: z.string(),
        riskProfile: z.string(),
        preferredDexs: z.array(z.string()),
      });
      
      const validatedData = settingsSchema.parse(req.body);
      
      const settings = await storage.saveUserSettings(validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Error saving settings:", error);
      res.status(500).json({ error: "Failed to save settings" });
    }
  });

  app.get("/api/settings/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const settings = await storage.getUserSettings(walletAddress);
      
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
