import Link from "next/link";
import Image from "next/image";
import { connectDB } from "@/lib/db";
import Review from "@/models/Review";
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi";

export default async function Home() {
  try {
    await connectDB();

    // 最新の10件のレビューを取得
    const latestReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // レビューされたゲームのIDを収集
    const gameIds = [...new Set(latestReviews.map((review) => review.gameId))];

    // BGGからゲーム情報を取得
    const detailsData = await fetchBGGData(`thing?id=${gameIds.join(",")}`);
    const detailsDoc = await parseXMLResponse(detailsData);
    const items = detailsDoc.getElementsByTagName("item");

    const games = Array.from(items).map((item) => ({
      id: item.getAttribute("id"),
      name:
        item.querySelector('name[type="primary"]')?.getAttribute("value") || "",
      image: item.querySelector("image")?.textContent || "/placeholder.svg",
      averageScore: parseFloat(
        latestReviews.find((r) => r.gameId === item.getAttribute("id"))
          ?.overallScore || "0"
      ),
      reviewDate: latestReviews.find(
        (r) => r.gameId === item.getAttribute("id")
      )?.createdAt,
    }));

    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          最近レビューされたゲーム
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id}>
              <div className="game-card group relative">
                <div className="relative w-full h-80">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center 20%" }}
                    className="object-center"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      詳細を見る
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-noto-sans-jp font-bold mb-2">
                    {game.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">評価：</span>
                      <span className="text-gray-600 font-bold text-2xl">
                        {game.averageScore.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(game.reviewDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error:", error);
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">データの取得に失敗しました。</p>
      </div>
    );
  }
}
