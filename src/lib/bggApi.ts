export async function fetchBGGData(endpoint: string) {
  try {
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/${endpoint}`)
    if (!response.ok) {
      throw new Error(`BGG API error: ${response.status}`)
    }
    return await response.text()
  } catch (error) {
    console.error('Error fetching from BGG:', error)
    throw error
  }
}

export function parseXMLResponse(xmlText: string) {
  const parser = new DOMParser()
  return parser.parseFromString(xmlText, 'text/xml')
} 