import { 
  type Token, type InsertToken, 
  type SwapRoute, type InsertSwapRoute,
  type AIAnalysis, type InsertAIAnalysis,
  type UserSettings, type InsertUserSettings 
} from "@shared/schema";
import { DEFAULT_TOKENS } from "../client/src/lib/constants";

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Token related methods
  getTokens(): Promise<Token[]>;
  getTokenBySymbol(symbol: string): Promise<Token | undefined>;
  createToken(token: InsertToken): Promise<Token>;
  
  // Swap route related methods
  getSwapRoutes(fromTokenId: number, toTokenId: number): Promise<SwapRoute[]>;
  createSwapRoute(route: InsertSwapRoute): Promise<SwapRoute>;
  
  // AI analysis related methods
  getAIAnalysis(fromTokenId: number, toTokenId: number): Promise<AIAnalysis | undefined>;
  createAIAnalysis(analysis: InsertAIAnalysis): Promise<AIAnalysis>;
  
  // User settings related methods
  getUserSettings(walletAddress: string): Promise<UserSettings | undefined>;
  saveUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
}

// Add the User type from the original file
import { users, type User, type InsertUser } from "@shared/schema";

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tokens: Map<number, Token>;
  private swapRoutes: Map<number, SwapRoute>;
  private aiAnalyses: Map<number, AIAnalysis>;
  private userSettings: Map<string, UserSettings>;
  
  currentUserId: number;
  currentTokenId: number;
  currentRouteId: number;
  currentAnalysisId: number;
  currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.tokens = new Map();
    this.swapRoutes = new Map();
    this.aiAnalyses = new Map();
    this.userSettings = new Map();
    
    this.currentUserId = 1;
    this.currentTokenId = 1;
    this.currentRouteId = 1;
    this.currentAnalysisId = 1;
    this.currentSettingsId = 1;
    
    // Initialize with default tokens
    DEFAULT_TOKENS.forEach(token => {
      this.tokens.set(this.currentTokenId, {
        id: this.currentTokenId,
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        decimals: token.decimals.toString(),
        logoUrl: token.logoUrl,
        isTestnet: true
      });
      this.currentTokenId++;
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Token methods
  async getTokens(): Promise<Token[]> {
    return Array.from(this.tokens.values());
  }
  
  async getTokenBySymbol(symbol: string): Promise<Token | undefined> {
    return Array.from(this.tokens.values()).find(
      (token) => token.symbol === symbol,
    );
  }
  
  async createToken(insertToken: InsertToken): Promise<Token> {
    const id = this.currentTokenId++;
    const token: Token = { ...insertToken, id };
    this.tokens.set(id, token);
    return token;
  }
  
  // Swap route methods
  async getSwapRoutes(fromTokenId: number, toTokenId: number): Promise<SwapRoute[]> {
    return Array.from(this.swapRoutes.values()).filter(
      (route) => route.fromTokenId === fromTokenId && route.toTokenId === toTokenId,
    );
  }
  
  async createSwapRoute(insertRoute: InsertSwapRoute): Promise<SwapRoute> {
    const id = this.currentRouteId++;
    const route: SwapRoute = { ...insertRoute, id };
    this.swapRoutes.set(id, route);
    return route;
  }
  
  // AI analysis methods
  async getAIAnalysis(fromTokenId: number, toTokenId: number): Promise<AIAnalysis | undefined> {
    return Array.from(this.aiAnalyses.values()).find(
      (analysis) => analysis.fromTokenId === fromTokenId && analysis.toTokenId === toTokenId,
    );
  }
  
  async createAIAnalysis(insertAnalysis: InsertAIAnalysis): Promise<AIAnalysis> {
    const id = this.currentAnalysisId++;
    const analysis: AIAnalysis = { 
      ...insertAnalysis, 
      id,
      createdAt: new Date()
    };
    this.aiAnalyses.set(id, analysis);
    return analysis;
  }
  
  // User settings methods
  async getUserSettings(walletAddress: string): Promise<UserSettings | undefined> {
    return this.userSettings.get(walletAddress);
  }
  
  async saveUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    // Check if settings already exist for this wallet
    const existingSettings = await this.getUserSettings(insertSettings.walletAddress);
    
    if (existingSettings) {
      // Update existing settings
      const updatedSettings: UserSettings = {
        ...existingSettings,
        ...insertSettings,
        lastUpdated: new Date()
      };
      this.userSettings.set(insertSettings.walletAddress, updatedSettings);
      return updatedSettings;
    } else {
      // Create new settings
      const id = this.currentSettingsId++;
      const settings: UserSettings = {
        ...insertSettings,
        id,
        lastUpdated: new Date()
      };
      this.userSettings.set(insertSettings.walletAddress, settings);
      return settings;
    }
  }
}

export const storage = new MemStorage();
