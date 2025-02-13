import express from "express";
import next from "next";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDBの接続設定を関数として分離
async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/boardgame-review"
    );
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

    // モデルを動的にインポート
    const { default: Game } = await import("./src/models/Game.js");
    const { default: Review } = await import("./src/models/Review.js");

    // APIルートの設定
    server.get("/api/games", async (req, res) => {
      try {
        const games = await Game.find({}).lean();
        res.json(games);
      } catch (err) {
        console.error("Error fetching games:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    server.get("/api/reviews", async (req, res) => {
      try {
        const reviews = await Review.find({}).lean();
        res.json(reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        res.status(500).json({ error: "Internal Server Error" });
      }
    });

    // Next.jsのページハンドリング
    server.all("*", (req, res) => {
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
