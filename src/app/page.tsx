import Link from "next/link";
import Image from "next/image";
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi";

interface Game {
  id: string;
  name: string;
  image: string;
  averageScore: number;
}

export default async function Home() {
  try {
    // BGG APIのホットゲームリストを取得
    const hotData = await fetchBGGData("hot?type=boardgame");
    const hotDoc = await parseXMLResponse(hotData);
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
    const detailsDoc = await parseXMLResponse(detailsData);
    const detailItems = detailsDoc.getElementsByTagName("item");

    // ゲーム情報を整形
    const games = Array.from(detailItems).map((item) => ({
      id: item.getAttribute("id") || "",
      name:
        item.querySelector('name[type="primary"]')?.getAttribute("value") || "",
      image: item.querySelector("thumbnail")?.textContent || "/placeholder.svg",
      averageScore: parseFloat(
        item
          .querySelector("statistics > ratings > average")
          ?.getAttribute("value") || "0"
      ),
    }));

    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          人気のボードゲーム
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id}>
              <div className="game-card">
                <div className="relative w-full h-48">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2">{game.name}</h2>
                  <p className="text-gray-600">
                    平均評価: {game.averageScore.toFixed(1)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error fetching games:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          エラーが発生しました
        </h1>
        <p className="text-center text-red-600">
          ゲーム情報の取得中にエラーが発生しました。しばらく経ってから再度お試しください。
        </p>
      </div>
    );
  }
}
