import Link from "next/link"
import Image from "next/image"

const games = [
  {
    id: 1,
    name: "カタン",
    image: "/placeholder.svg?height=150&width=150",
    players: "3-4",
    time: 120,
    averageScore: 8.5,
    shortReviews: [
      { comment: "資源管理が楽しい！", likes: 50 },
      { comment: "戦略性が高くて面白い", likes: 45 },
      { comment: "友達と遊ぶのに最適", likes: 40 },
    ],
  },
  {
    id: 2,
    name: "カルカソンヌ",
    image: "/placeholder.svg?height=150&width=150",
    players: "2-5",
    time: 45,
    averageScore: 8.2,
    shortReviews: [
      { comment: "タイル配置が面白い", likes: 55 },
      { comment: "簡単なルールで奥が深い", likes: 48 },
      { comment: "家族で楽しめる", likes: 42 },
    ],
  },
  {
    id: 3,
    name: "ドミニオン",
    image: "/placeholder.svg?height=150&width=150",
    players: "2-4",
    time: 30,
    averageScore: 8.7,
    shortReviews: [
      { comment: "デッキ構築の王道", likes: 60 },
      { comment: "組み合わせの妙が面白い", likes: 52 },
      { comment: "リプレイ性が高い", likes: 47 },
    ],
  },
]

function getRandomShortReview(reviews) {
  return reviews[Math.floor(Math.random() * reviews.length)].comment
}

export default function GameList() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-display text-primary mb-8 text-center">ボードゲーム一覧</h1>
      <div className="grid gap-6">
        {games.map((game) => (
          <Link
            href={`/games/${game.id}`}
            key={game.id}
            className="card flex hover:shadow-xl transition-shadow duration-300"
          >
            <Image
              src={game.image || "/placeholder.svg"}
              alt={game.name}
              width={150}
              height={150}
              className="w-40 h-40 object-cover"
            />
            <div className="p-4 flex-grow">
              <h2 className="text-2xl font-display text-primary mb-2">{game.name}</h2>
              <p className="text-black">プレイ人数: {game.players}</p>
              <p className="text-black">平均プレイ時間: {game.time}分</p>
              <p className="text-black">平均総合得点: {game.averageScore.toFixed(1)}</p>
              <p className="mt-2 italic text-black">"{getRandomShortReview(game.shortReviews)}"</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex justify-center space-x-4">
        <button className="btn btn-secondary">前のページ</button>
        <button className="btn btn-secondary">次のページ</button>
      </div>
    </div>
  )
}

