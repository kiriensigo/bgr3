import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // TODO: Implement actual BGG API call
  const games = [
    {
      id: 1,
      name: "カタン",
      image: "/placeholder.svg?height=150&width=150",
      year: 1995,
      players: "3-4",
      age: 10,
      time: 120,
    },
    {
      id: 2,
      name: "カルカソンヌ",
      image: "/placeholder.svg?height=150&width=150",
      year: 2000,
      players: "2-5",
      age: 7,
      time: 45,
    },
    {
      id: 3,
      name: "ドミニオン",
      image: "/placeholder.svg?height=150&width=150",
      year: 2008,
      players: "2-4",
      age: 13,
      time: 30,
    },
    // Add more games here...
  ]

  return NextResponse.json(games)
}

