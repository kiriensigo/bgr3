"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi";

interface Game {
  id: string;
  name: string;
  image: string;
  averageScore: number;
}

export default function Home() {
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        // BGG APIのホットゲームリストを取得
        const hotData = await fetchBGGData("hot?type=boardgame");
        const hotDoc = parseXMLResponse(hotData);
        const items = hotDoc.getElementsByTagName("item");

        // 最初の5つのゲームのIDを取得
        const gameIds = Array.from(items)
          .slice(0, 5)
          .map((item) => item.getAttribute("id"))
          .filter((id): id is string => id !== null);

        // 各ゲームの詳細情報を取得
        const detailsData = await fetchBGGData(
          `thing?id=${gameIds.join(",")}&stats=1`
        );
        const detailsDoc = parseXMLResponse(detailsData);
        const detailItems = detailsDoc.getElementsByTagName("item");

        // ゲーム情報を整形
        const games = Array.from(detailItems).map((item) => ({
          id: item.getAttribute("id") || "",
          name:
            item.querySelector('name[type="primary"]')?.getAttribute("value") ||
            "",
          image: item.querySelector("image")?.textContent || "/placeholder.svg",
          averageScore: parseFloat(
            item
              .querySelector("statistics > ratings > average")
              ?.getAttribute("value") || "0"
          ),
        }));

        setRecentGames(games);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl sm:text-4xl font-display text-primary text-center">
        人気のボードゲーム
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {recentGames.map((game) => (
          <Link href={`/games/${game.id}`} key={game.id} className="card group">
            <div className="relative aspect-square">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+"
                placeholder="blur"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-white font-semibold">詳細を見る</span>
              </div>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2">{game.name}</h2>
              <p className="text-black font-bold">
                評価: {game.averageScore.toFixed(1)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="text-center">
        <Link href="/games" className="btn btn-primary">
          もっと見る
        </Link>
      </div>
    </div>
  );
}
