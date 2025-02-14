import Image from "next/image"
import Link from "next/link"
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi"

interface GameDetails {
  id: string
  name: string
  image: string
  yearPublished: string
  minPlayers: string
  maxPlayers: string
  playingTime: string
  averageRating: number
  weight: number
  bggLink: string
  amazonLink: string
  rakutenLink: string
}

interface Review {
  overallScore: number
  playTime: number
  ruleComplexity: number
  luckFactor: number
  interaction: number
  downtime: number
  gameId: string
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function GameDetailsPage({ params }: PageProps) {
  try {
    // BGGデータの取得
    const data = await fetchBGGData(`thing?id=${params.id}&stats=1`)
    const doc = await parseXMLResponse(data)
    const item = doc.getElementsByTagName('item')[0]

    if (!item) {
      throw new Error('Game not found')
    }

    // サイト内レビューの取得
    const reviewsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/reviews`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!reviewsResponse.ok) {
      console.error('Failed to fetch reviews:', await reviewsResponse.text());
      throw new Error('Failed to fetch reviews');
    }

    const reviews = await reviewsResponse.json();

    // レビューをフィルタリングして現在のゲームのレビューのみを取得
    const gameReviews = reviews.filter((review: Review) => review.gameId === params.id);

    // レビューの平均値を計算
    const averageReviews = gameReviews.length > 0 ? {
      overallScore: gameReviews.reduce((acc, rev) => acc + rev.overallScore, 0) / gameReviews.length,
      playTime: gameReviews.reduce((acc, rev) => acc + rev.playTime, 0) / gameReviews.length,
      ruleComplexity: gameReviews.reduce((acc, rev) => acc + rev.ruleComplexity, 0) / gameReviews.length,
      luckFactor: gameReviews.reduce((acc, rev) => acc + rev.luckFactor, 0) / gameReviews.length,
      interaction: gameReviews.reduce((acc, rev) => acc + rev.interaction, 0) / gameReviews.length,
      downtime: gameReviews.reduce((acc, rev) => acc + rev.downtime, 0) / gameReviews.length,
    } : null;

    const gameDetails: GameDetails = {
      id: item.getAttribute('id') || '',
      name: item.querySelector('name[type="primary"]')?.getAttribute('value') || '',
      image: item.querySelector('image')?.textContent || '/placeholder.svg',
      yearPublished: item.querySelector('yearpublished')?.getAttribute('value') || '',
      minPlayers: item.querySelector('minplayers')?.getAttribute('value') || '',
      maxPlayers: item.querySelector('maxplayers')?.getAttribute('value') || '',
      playingTime: item.querySelector('playingtime')?.getAttribute('value') || '',
      averageRating: parseFloat(
        item.querySelector('statistics > ratings > average')?.getAttribute('value') || '0'
      ),
      weight: parseFloat(
        item.querySelector('statistics > ratings > averageweight')?.getAttribute('value') || '0'
      ),
      bggLink: `https://boardgamegeek.com/boardgame/${params.id}`,
      amazonLink: `https://www.amazon.co.jp/s?k=${encodeURIComponent(item.querySelector('name[type="primary"]')?.getAttribute('value') || '')}+ボードゲーム`,
      rakutenLink: `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(item.querySelector('name[type="primary"]')?.getAttribute('value') || '')}+ボードゲーム/`,
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 p-4">
                <div className="relative h-72 w-full">
                  <Image
                    src={gameDetails.image}
                    alt={gameDetails.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-4">
                <h1 className="text-3xl font-noto-sans-jp font-bold mb-4">{gameDetails.name}</h1>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">発売年: {gameDetails.yearPublished}</p>
                    <p className="text-gray-600">プレイ人数: {gameDetails.minPlayers}-{gameDetails.maxPlayers}人</p>
                    <p className="text-gray-600">プレイ時間: {gameDetails.playingTime}分</p>
                  </div>
                </div>

                {averageReviews ? (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-3">サイト内レビュー平均</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">総合評価: {averageReviews.overallScore.toFixed(1)}</p>
                        <p className="text-gray-600">プレイ時間の適正さ: {averageReviews.playTime.toFixed(1)}</p>
                        <p className="text-gray-600">ルールの複雑さ: {averageReviews.ruleComplexity.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">運要素: {averageReviews.luckFactor.toFixed(1)}</p>
                        <p className="text-gray-600">プレイヤー間交流: {averageReviews.interaction.toFixed(1)}</p>
                        <p className="text-gray-600">待ち時間: {averageReviews.downtime.toFixed(1)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-6">まだレビューがありません</p>
                )}

                <div className="flex flex-wrap gap-4 mb-6">
                  <Link href={gameDetails.bggLink} target="_blank" className="text-blue-600 hover:underline">
                    BGGで見る
                  </Link>
                  <Link href={gameDetails.amazonLink} target="_blank" className="text-blue-600 hover:underline">
                    Amazonで探す
                  </Link>
                  <Link href={gameDetails.rakutenLink} target="_blank" className="text-blue-600 hover:underline">
                    楽天で探す
                  </Link>
                </div>
                <Link 
                  href={`/games/${gameDetails.id}/review`}
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  レビューを書く
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching game details:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">ゲーム情報の取得に失敗しました。</p>
      </div>
    )
  }
}

