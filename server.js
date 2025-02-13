const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const Game = require('./models/Game');
const Review = require('./models/Review');
require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDBの接続設定
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/boardgame-review');
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // エラー時に即座にプロセスを終了せず、再試行できるようにする
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

app.prepare().then(() => {
  const server = express();
  
  // APIルートの設定
  server.get('/api/games', async (req, res) => {
    try {
      const games = await Game.find({}).lean();
      res.json({ success: true, games });
    } catch (err) {
      console.error('Error fetching games:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  server.get('/api/reviews', async (req, res) => {
    try {
      const reviews = await Review.find({}).lean();
      res.json({ success: true, reviews });
    } catch (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  });

  // API routes
  server.all('/api/*', (req, res) => {
    return handle(req, res);
  });

  // Next.jsのページハンドリング
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
    connectDB();
  });
}); 