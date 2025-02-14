export async function fetchBGGData(endpoint: string) {
  try {
    const response = await fetch(`https://boardgamegeek.com/xmlapi2/${endpoint}`, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });
    
    if (!response.ok) {
      throw new Error('BGG APIからのデータ取得に失敗しました');
    }

    const data = await response.text();
    return data;
  } catch (error) {
    console.error('BGG APIエラー:', error);
    throw new Error('BGG APIからのデータ取得に失敗しました');
  }
}

export async function parseXMLResponse(xmlText: string) {
  if (typeof window === 'undefined') {
    // サーバーサイドの場合
    const { JSDOM } = await import('jsdom');
    const dom = new JSDOM(xmlText, {
      contentType: "text/xml"
    });
    return dom.window.document;
  } else {
    // クライアントサイドの場合
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    
    // エラーチェック
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XMLのパースに失敗しました');
    }
    
    return doc;
  }
} 