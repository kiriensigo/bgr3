"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FlashMessage } from "@/components/FlashMessage";
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi";

interface GameDetails {
  id: string;
  name: string;
  image: string;
  bggLink: string;
  amazonLink: string;
  rakutenLink: string;
}

const mechanics = [
  "オークション",
  "ダイスロール",
  "タイル/カード配置",
  "ブラフ",
  "エリアマジョリティ",
  "ワーカープレイスメント",
  "正体隠匿系",
  "モジュラーボード",
  "チキンレース",
  "ドラフト",
  "デッキ/バッグビルディング",
  "トリックテイキング",
  "拡大再生産",
];

const tags = [
  "子どもと大人が遊べる",
  "子どもにおすすめ",
  "大人におすすめ",
  "二人におすすめ",
  "ソロにおすすめ",
  "デザイン性が高い",
  "リプレイ性が高い",
  "パーティ向き",
  "謎解き",
  "チーム戦",
  "協力",
  "パズル",
  "レガシー（ストーリー）",
  "動物",
];

export default function ReviewForm({ params }: { params: { id: string } }) {
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState({
    overallScore: 5,
    playTime: 2,
    ruleComplexity: 3,
    luckFactor: 3,
    interaction: 3,
    downtime: 3,
    recommendedPlayers: [],
    mechanics: [],
    tags: [],
    customTags: "",
    shortComment: "",
  });
  const [flashMessage, setFlashMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGameDetails() {
      try {
        const data = await fetchBGGData(`thing?id=${params.id}&stats=1`);
        const doc = await parseXMLResponse(data);
        const item = doc.getElementsByTagName('item')[0];

        if (!item) {
          throw new Error('ゲームが見つかりませんでした');
        }

        const name = item.querySelector('name[type="primary"]')?.getAttribute('value') || '';
        
        setGame({
          id: params.id,
          name: name,
          image: item.querySelector('image')?.textContent || '/placeholder.svg',
          bggLink: `https://boardgamegeek.com/boardgame/${params.id}`,
          amazonLink: `https://www.amazon.co.jp/s?k=${encodeURIComponent(name)}+ボードゲーム`,
          rakutenLink: `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(name)}+ボードゲーム/`,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'エラーが発生しました');
      } finally {
        setLoading(false);
      }
    }

    fetchGameDetails();
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReview((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
            ? [...prev[name], value]
            : prev[name].filter((item) => item !== value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーションチェック
    if (!review.shortComment.trim()) {
      setFlashMessage('一言コメントは必須です');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...review,
          gameId: params.id,
          shortComment: review.shortComment.trim(), // 空白を除去
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFlashMessage('レビューを投稿しました');
        // フォームをリセット
        setReview({
          overallScore: 5,
          playTime: 2,
          ruleComplexity: 3,
          luckFactor: 3,
          interaction: 3,
          downtime: 3,
          recommendedPlayers: [],
          mechanics: [],
          tags: [],
          customTags: '',
          shortComment: '',
        });
      } else {
        setFlashMessage(data.error || 'レビューの投稿に失敗しました');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setFlashMessage('レビューの投稿に失敗しました');
    }
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!game) {
    return <div className="text-center py-8">ゲームが見つかりませんでした</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{game.name}のレビュー</h1>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div className="relative h-64 w-full">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">{game.name}</h2>
            <div className="flex flex-col gap-2">
              <Link href={game.bggLink} target="_blank" className="text-blue-600 hover:underline">
                BoardGameGeekで見る
              </Link>
              <Link href={game.amazonLink} target="_blank" className="text-blue-600 hover:underline">
                Amazonで見る
              </Link>
              <Link href={game.rakutenLink} target="_blank" className="text-blue-600 hover:underline">
                楽天で見る
              </Link>
            </div>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-semibold">
            総合得点: {review.overallScore}
          </label>
          <input
            type="range"
            name="overallScore"
            min="1"
            max="10"
            step="0.5"
            value={review.overallScore}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">プレイ時間</label>
          <input
            type="range"
            name="playTime"
            min="1"
            max="5"
            step="0.5"
            value={review.playTime}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>30分以内</span>
            <span>45分</span>
            <span>1時間</span>
            <span>1時間半</span>
            <span>2時間</span>
            <span>2時間半以上</span>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">
            ルール難度: {review.ruleComplexity}
          </label>
          <input
            type="range"
            name="ruleComplexity"
            min="1"
            max="5"
            step="0.5"
            value={review.ruleComplexity}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>優しい</span>
            <span>難しい</span>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">
            運要素: {review.luckFactor}
          </label>
          <input
            type="range"
            name="luckFactor"
            min="1"
            max="5"
            step="0.5"
            value={review.luckFactor}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>低い</span>
            <span>高い</span>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">
            インタラクション: {review.interaction}
          </label>
          <input
            type="range"
            name="interaction"
            min="1"
            max="5"
            step="0.5"
            value={review.interaction}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>弱い</span>
            <span>強い</span>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">
            ダウンタイム: {review.downtime}
          </label>
          <input
            type="range"
            name="downtime"
            min="1"
            max="5"
            step="0.5"
            value={review.downtime}
            onChange={handleChange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>短い</span>
            <span>長い</span>
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">おすすめプレイ人数</label>
          <div className="flex space-x-4">
            {[1, 2, 3, 4, 5, "6人以上"].map((num) => (
              <label key={num} className="flex items-center">
                <input
                  type="checkbox"
                  name="recommendedPlayers"
                  value={num}
                  checked={review.recommendedPlayers.includes(num.toString())}
                  onChange={handleChange}
                  className="mr-2"
                />
                {num}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">メカニクス</label>
          <div className="grid grid-cols-2 gap-2">
            {mechanics.map((mechanic) => (
              <label key={mechanic} className="flex items-center">
                <input
                  type="checkbox"
                  name="mechanics"
                  value={mechanic}
                  checked={review.mechanics.includes(mechanic)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {mechanic}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">タグ</label>
          <div className="grid grid-cols-2 gap-2">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  name="tags"
                  value={tag}
                  checked={review.tags.includes(tag)}
                  onChange={handleChange}
                  className="mr-2"
                />
                {tag}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block mb-2 font-semibold">カスタムタグ</label>
          <input
            type="text"
            name="customTags"
            value={review.customTags}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="カンマ区切りで入力"
          />
        </div>
        <div>
          <label className="block mb-2 font-semibold">
            一言コメント<span className="text-red-500">*</span>
          </label>
          <textarea
            name="shortComment"
            value={review.shortComment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="このゲームの魅力を一言で表現してください（必須）"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          レビューを投稿
        </button>
      </form>
      {flashMessage && (
        <FlashMessage
          message={flashMessage}
          onClose={() => setFlashMessage(null)}
        />
      )}
    </div>
  );
}
