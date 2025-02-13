"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi"

interface GameDetails {
  id: string
  name: string
  image: string
  description: string
  yearPublished: string
  minPlayers: string
  maxPlayers: string
  playingTime: string
  averageRating: number
  weight: number // ルールの複雑さ
  bggLink: string
  amazonLink: string
  rakutenLink: string
}

export default function GameDetails({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<GameDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGame() {
      try {
        const data = await fetchBGGData(`thing?id=${params.id}&stats=1`)
        const doc = parseXMLResponse(data)
        const item = doc.getElementsByTagName('item')[0]

        if (!item) {
          throw new Error('Game not found')
        }

        const gameDetails: GameDetails = {
          id: item.getAttribute('id') || '',
          name: item.querySelector('name[type="primary"]')?.getAttribute('value') || '',
          image: item.querySelector('image')?.textContent || '/placeholder.svg',
          description: item.querySelector('description')?.textContent?.trim() || '',
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

        setGame(gameDetails)
      } catch (err) {
        setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました')
        console.error('Error fetching game details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !game) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error || 'ゲームが見つかりませんでした'}</p>
        <Link href="/" className="btn btn-primary mt-4">
          ホームに戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* 画像セクション */}
          <div className="md:w-1/3">
            <div className="relative aspect-square">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>

          {/* 詳細情報セクション */}
          <div className="md:w-2/3 p-6">
            <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h2 className="text-gray-600">プレイ人数</h2>
                <p>{game.minPlayers}-{game.maxPlayers}人</p>
              </div>
              <div>
                <h2 className="text-gray-600">プレイ時間</h2>
                <p>{game.playingTime}分</p>
              </div>
              <div>
                <h2 className="text-gray-600">発売年</h2>
                <p>{game.yearPublished}年</p>
              </div>
              <div>
                <h2 className="text-gray-600">BGG評価</h2>
                <p>{game.averageRating.toFixed(1)}/10</p>
              </div>
              <div>
                <h2 className="text-gray-600">ルールの複雑さ</h2>
                <p>{game.weight.toFixed(1)}/5</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href={game.bggLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                BGGで見る
              </Link>
              <Link
                href={game.amazonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Amazonで見る
              </Link>
              <Link
                href={game.rakutenLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                楽天で見る
              </Link>
              <Link
                href={`/games/${game.id}/review`}
                className="btn btn-primary"
              >
                レビューを書く
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

