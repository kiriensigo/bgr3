"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

// 仮のゲームデータ（実際の実装では、APIからデータを取得します）
const games = [
  {
    id: 1,
    name: "カタン",
    designer: "クラウス・トイバー",
    publisher: "コスモス",
    image: "/placeholder.svg?height=150&width=150",
    rating: 8.5,
    tags: ["戦略", "交渉"],
    mechanics: ["ダイスロール", "タイル配置"],
    recommendedPlayers: [3, 4],
    reviewCount: 120,
  },
  {
    id: 2,
    name: "カルカソンヌ",
    designer: "クラウス＝ユルゲン・ヴレーデ",
    publisher: "ホビージャパン",
    image: "/placeholder.svg?height=150&width=150",
    rating: 8.2,
    tags: ["タイル配置", "戦略"],
    mechanics: ["タイル配置", "エリアマジョリティ"],
    recommendedPlayers: [2, 3, 4, 5],
    reviewCount: 95,
  },
  // さらにゲームを追加...
]

const tags = ["戦略", "交渉", "タイル配置", "カードゲーム", "パーティーゲーム", "動物"] // 実際にはもっと多くのタグがあります
const mechanics = [
  "オークション",
  "ダイスロール",
  "タイル配置",
  "ブラフ",
  "エリアマジョリティ",
  "ワーカープレイスメント",
]
const playerCounts = [1, 2, 3, 4, 5, "6人以上"]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState([])
  const [selectedMechanics, setSelectedMechanics] = useState([])
  const [selectedPlayerCounts, setSelectedPlayerCounts] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("name")

  const filteredGames = games
    .filter(
      (game) =>
        (game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.designer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.publisher.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (selectedTags.length === 0 || selectedTags.every((tag) => game.tags.includes(tag))) &&
        (selectedMechanics.length === 0 || selectedMechanics.every((mechanic) => game.mechanics.includes(mechanic))) &&
        (selectedPlayerCounts.length === 0 ||
          selectedPlayerCounts.some((count) => game.recommendedPlayers.includes(Number.parseInt(count)))) &&
        game.rating >= minRating,
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name)
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "reviews") return b.reviewCount - a.reviewCount
      return 0
    })

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ボードゲーム検索</h1>
      <div className="mb-6">
        <input
          type="text"
          placeholder="ゲーム名、デザイナー、出版社で検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">おすすめプレイ人数でフィルター</h2>
        <div className="flex flex-wrap gap-2">
          {playerCounts.map((count) => (
            <label key={count} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedPlayerCounts.includes(count.toString())}
                onChange={() => {
                  setSelectedPlayerCounts((prev) =>
                    prev.includes(count.toString())
                      ? prev.filter((c) => c !== count.toString())
                      : [...prev, count.toString()],
                  )
                }}
                className="mr-2"
              />
              {count}人
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">メカニクスでフィルター</h2>
        <div className="flex flex-wrap gap-2">
          {mechanics.map((mechanic) => (
            <label key={mechanic} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedMechanics.includes(mechanic)}
                onChange={() => {
                  setSelectedMechanics((prev) =>
                    prev.includes(mechanic) ? prev.filter((m) => m !== mechanic) : [...prev, mechanic],
                  )
                }}
                className="mr-2"
              />
              {mechanic}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">タグでフィルター</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <label key={tag} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => {
                  setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
                }}
                className="mr-2"
              />
              {tag}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">最低評価点</h2>
        <input
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={minRating}
          onChange={(e) => setMinRating(Number.parseFloat(e.target.value))}
          className="w-full"
        />
        <span>{minRating.toFixed(1)}点以上</span>
      </div>
      <div className="mb-6">
        <label className="mr-2">並べ替え:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded">
          <option value="name">名前順</option>
          <option value="rating">得点順</option>
          <option value="reviews">レビュー数順</option>
        </select>
      </div>
      <div className="grid gap-6">
        {filteredGames.map((game) => (
          <Link
            href={`/games/${game.id}`}
            key={game.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex hover:shadow-lg transition-shadow duration-300"
          >
            <Image
              src={game.image || "/placeholder.svg"}
              alt={game.name}
              width={150}
              height={150}
              className="w-40 h-40 object-cover"
            />
            <div className="p-4 flex-grow">
              <h2 className="text-xl font-semibold hover:text-blue-600">{game.name}</h2>
              <p className="text-gray-600">デザイナー: {game.designer}</p>
              <p className="text-gray-600">出版社: {game.publisher}</p>
              <p className="text-gray-600">評価: {game.rating.toFixed(1)}</p>
              <div className="mt-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

