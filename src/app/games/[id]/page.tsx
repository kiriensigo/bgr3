"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

// 仮のゲームデータとレビューデータ（実際の実装では、APIからデータを取得します）
const game = {
  id: 1,
  name: "カタン",
  image: "/placeholder.svg?height=300&width=300",
  bggLink: "https://boardgamegeek.com/boardgame/13/catan",
  amazonLink: "https://www.amazon.co.jp/dp/B00005BFUU?tag=youraffiliateid-22",
  rakutenLink:
    "https://hb.afl.rakuten.co.jp/hgc/youraffiliateid/?pc=https%3A%2F%2Fitem.rakuten.co.jp%2Fboardgame%2F10000001%2F",
  averageRatings: {
    overallScore: 8.2,
    ruleComplexity: 2.3,
    luckFactor: 3.1,
    interaction: 4.5,
    downtime: 1.8,
  },
  averagePlayTime: 75, // 仮の値として75分を設定
  topTags: ["戦略", "交渉"],
  topRecommendedPlayers: ["3人", "4人"],
}

const initialReviews = [
  { id: 1, user: "ユーザー1", rating: 8, content: "素晴らしいゲームです！", likes: 5, date: "2023-05-01" },
  { id: 2, user: "ユーザー2", rating: 7, content: "楽しいけど運要素が強いかも", likes: 3, date: "2023-05-02" },
  { id: 3, user: "ユーザー3", rating: 9, content: "友達と遊ぶのに最高！", likes: 8, date: "2023-05-03" },
]

export default function GameReviews({ params }) {
  const [reviews, setReviews] = useState(initialReviews)

  const handleLike = (reviewId) => {
    setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: review.likes + 1 } : review)))
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex mb-6">
        <Image src={game.image || "/placeholder.svg"} alt={game.name} width={300} height={300} className="rounded-lg" />
        <div className="ml-6">
          <h1 className="text-3xl font-bold mb-2">{game.name}</h1>
          <Link
            href={game.bggLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block mb-2"
          >
            BoardGameGeekで見る
          </Link>
          <Link
            href={game.amazonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block mb-2"
          >
            Amazonで見る
          </Link>
          <Link
            href={game.rakutenLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline block mb-2"
          >
            楽天で見る
          </Link>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold mb-2">総合得点</h2>
            <span className="text-4xl font-bold text-primary">{game.averageRatings.overallScore.toFixed(1)}</span>
            <span className="text-xl">/10</span>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">平均評価</h2>
            <ul>
              <li>ルール難度: {game.averageRatings.ruleComplexity.toFixed(1)}</li>
              <li>運要素: {game.averageRatings.luckFactor.toFixed(1)}</li>
              <li>インタラクション: {game.averageRatings.interaction.toFixed(1)}</li>
              <li>ダウンタイム: {game.averageRatings.downtime.toFixed(1)}</li>
              <li>プレイ時間平均: {game.averagePlayTime}分</li>
            </ul>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">人気のタグ</h2>
            <div className="flex space-x-2">
              {game.topTags.map((tag) => (
                <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">おすすめプレイ人数</h2>
            <p>{game.topRecommendedPlayers.join(", ")}</p>
          </div>
          <Link
            href={`/games/${params.id}/review`}
            className="block mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            レビューを書く
          </Link>
        </div>
      </div>
      <h2 className="text-2xl font-semibold mb-4">レビュー一覧</h2>
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{review.user}</span>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="text-xl font-bold mr-2">{review.rating}</span>
              <div className="text-yellow-400">{"★".repeat(review.rating) + "☆".repeat(10 - review.rating)}</div>
            </div>
            <p className="mb-2">{review.content}</p>
            <button onClick={() => handleLike(review.id)} className="text-blue-500 hover:underline flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              いいね！ ({review.likes})
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

