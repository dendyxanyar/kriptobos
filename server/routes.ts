import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import fetch from "node-fetch";

const API_HEADERS = {
  'accept': '*/*',
  'accept-language': 'en-US,en;q=0.9',
  'origin': 'https://app.resolv.xyz',
  'referer': 'https://app.resolv.xyz/',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36'
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy route for Resolv points
  app.get('/api/resolv/points/:address', async (req, res) => {
    try {
      const { address } = req.params;
      const response = await fetch(
        `https://api.resolv.im/points?address=${address}`,
        { headers: API_HEADERS }
      );

      if (!response.ok) {
        throw new Error(`Resolv API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching points:', error);
      res.status(500).json({ error: 'Failed to fetch points data' });
    }
  });

  // Proxy route for Resolv leaderboard
  app.get('/api/resolv/leaderboard/:address', async (req, res) => {
    try {
      const { address } = req.params;
      const response = await fetch(
        `https://api.resolv.im/points/leaderboard/slice?address=${address}`,
        { headers: API_HEADERS }
      );

      if (!response.ok) {
        throw new Error(`Resolv API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
  });

  // Proxy route for ENS resolution
  app.get('/api/resolv/ens/:name', async (req, res) => {
    try {
      const { name } = req.params;
      const response = await fetch(
        `https://api.ensideas.com/ens/resolve/${name}`
      );

      if (!response.ok) {
        throw new Error(`ENS API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Error resolving ENS:', error);
      res.status(500).json({ error: 'Failed to resolve ENS name' });
    }
  });

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);
  return httpServer;
}