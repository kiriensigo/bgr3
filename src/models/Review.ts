import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  gameId: {
    type: String,
    required: true,
  },
  overallScore: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  playTime: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  ruleComplexity: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  luckFactor: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  interaction: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  downtime: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  recommendedPlayers: [String],
  mechanics: [String],
  tags: [String],
  customTags: {
    type: String,
    required: false,
  },
  shortComment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// モデルが既に存在する場合は再利用し、存在しない場合は新規作成
const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review; 