import express from "express";
import next from "next";
import mongoose from "mongoose";
import { Request, Response } from "express";
import Game from "./src/models/Game";
import Review from "./src/models/Review";
import dotenv from "dotenv";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDBの接続設定
async function connectDB() {
  try {
    const uri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/boardgame-review";
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

// サーバー起動処理
async function startServer() {
  try {
    await app.prepare();
    const server = express();

    // MongoDBに接続
    await connectDB();

    // APIルートの設定
    server.get("/api/games", async (req: Request, res: Response) => {
      try {
        const games = await Game.find({}).lean();
        res.json(games);
      } catch (err) {
        console.error("Error fetching games:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    server.get("/api/reviews", async (req: Request, res: Response) => {
      try {
        const { gameId } = req.query;
        const query = gameId ? { gameId: gameId } : {};
        const reviews = await Review.find(query).lean();
        res.json(reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Next.jsのページハンドリング
    server.all("*", (req: Request, res: Response) => {
      return handle(req, res);
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`> Ready on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
}

startServer();
