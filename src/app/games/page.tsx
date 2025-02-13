import Link from "next/link"
import Image from "next/image"

// BGG APIからデータを取得する関数
async function fetchBGGGames() {
  try {
    // BGG APIのホットゲームリストを取得
    const hotResponse = await fetch('https://boardgamegeek.com/xmlapi2/hot?type=boardgame')
    const hotData = await hotResponse.text()
    
    // XMLをパースしてゲームIDのリストを取得
    const gameIds = Array.from(hotData.matchAll(/id="(\d+)"/g)).map(match => match[1])
    
    // 各ゲームの詳細情報を取得
    const detailsResponse = await fetch(`https://boardgamegeek.com/xmlapi2/thing?id=${gameIds.join(',')}`)
    const detailsData = await detailsResponse.text()
    
    // XMLをパースしてゲーム情報を整形
    const parser = new DOMParser()
    const doc = parser.parseFromString(detailsData, 'text/xml')
    const items = doc.getElementsByTagName('item')
    
    return Array.from(items).map(item => ({
      id: item.getAttribute('id'),
      name: item.querySelector('name[type="primary"]')?.getAttribute('value') || '',
      image: item.querySelector('image')?.textContent || '/placeholder.svg',
      description: item.querySelector('description')?.textContent || '',
      yearPublished: item.querySelector('yearpublished')?.getAttribute('value') || '',
      minPlayers: item.querySelector('minplayers')?.getAttribute('value') || '',
      maxPlayers: item.querySelector('maxplayers')?.getAttribute('value') || '',
      playingTime: item.querySelector('playingtime')?.getAttribute('value') || '',
    }))
  } catch (error) {
    console.error('Error fetching BGG data:', error)
    return []
  }
}

export default async function GameList() {
  const games = await fetchBGGGames()

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
            <div className="relative w-40 h-40">
              <Image
                src={game.image}
                alt={game.name}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <div className="p-4 flex-grow">
              <h2 className="text-2xl font-display text-primary mb-2">{game.name}</h2>
              <div className="text-sm text-gray-600 mb-2">
                <span>プレイ人数: {game.minPlayers}-{game.maxPlayers}人</span>
                <span className="mx-2">|</span>
                <span>プレイ時間: {game.playingTime}分</span>
                <span className="mx-2">|</span>
                <span>発売年: {game.yearPublished}</span>
              </div>
              <p className="text-black line-clamp-2">{game.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

