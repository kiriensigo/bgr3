import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";

export async function POST(request: Request) {
  try {
    await connectDB();

    const data = await request.json();
    
    const review = new Review({
      gameId: data.gameId,
      overallScore: data.overallScore,
      playTime: data.playTime,
      ruleComplexity: data.ruleComplexity,
      luckFactor: data.luckFactor,
      interaction: data.interaction,
      downtime: data.downtime,
      recommendedPlayers: data.recommendedPlayers,
      mechanics: data.mechanics,
      tags: [...data.tags, ...(data.customTags ? data.customTags.split(',').map(tag => tag.trim()) : [])],
      shortComment: data.shortComment,
      createdAt: new Date(),
    });

    await review.save();

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error('Error saving review:', error);
    return NextResponse.json(
      { success: false, error: 'レビューの保存に失敗しました' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    
    const query = gameId ? { gameId } : {};
    const reviews = await Review.find(query).lean();
    
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'レビューの取得に失敗しました' },
      { status: 500 }
    );
  }
} 