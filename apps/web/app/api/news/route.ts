import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 60; // Cache for 60 seconds

type CustomFeed = { title: string };
type CustomItem = { pubDate: string; contentSnippet: string; link: string; categories?: string[] };

const parser = new Parser<CustomFeed, CustomItem>({
  customFields: {
    item: ['pubDate', 'contentSnippet', 'link', 'categories'],
  }
});

// Helper to determine category based on keywords
function determineCategory(title: string, summary: string): string {
  const text = (title + ' ' + summary).toLowerCase();
  if (text.includes('earning') || text.includes('q1') || text.includes('q2') || text.includes('q3') || text.includes('q4') || text.includes('profit') || text.includes('revenue')) {
    return 'Earnings';
  }
  if (text.includes('fii') || text.includes('dii') || text.includes('inflow') || text.includes('outflow')) {
    return 'FII / DII Flows';
  }
  if (text.includes('bse') || text.includes('nse') || text.includes('sebi') || text.includes('announces') || text.includes('approves')) {
    return 'Announcements (BSE/NSE)';
  }
  return 'Company News';
}

// Helper to guess a ticker symbol based on Indian stock names
function extractTicker(title: string): string {
  const commonStocks = [
    { name: 'reliance', ticker: 'RELIANCE' },
    { name: 'tcs', ticker: 'TCS' },
    { name: 'infosys', ticker: 'INFY' },
    { name: 'hdfc', ticker: 'HDFCBANK' },
    { name: 'sbi', ticker: 'SBIN' },
    { name: 'icici', ticker: 'ICICIBANK' },
    { name: 'wipro', ticker: 'WIPRO' },
    { name: 'zomato', ticker: 'ZOMATO' },
    { name: 'tata motors', ticker: 'TATAMOTORS' },
    { name: 'itc', ticker: 'ITC' },
    { name: 'sensex', ticker: 'SENSEX' },
    { name: 'nifty', ticker: 'NIFTY' },
  ];
  
  const lowerTitle = title.toLowerCase();
  for (const stock of commonStocks) {
    if (lowerTitle.includes(stock.name)) {
      return stock.ticker;
    }
  }
  return 'MARKET'; // Default generic ticker
}

export async function GET() {
  try {
    // Google News RSS feed for Indian Stock Market / Corporate News
    const feedUrl = 'https://news.google.com/rss/search?q=Indian+Stock+Market+Earnings+BSE+NSE&hl=en-IN&gl=IN&ceid=IN:en';
    
    const feed = await parser.parseURL(feedUrl);
    
    const newsItems = feed.items.slice(0, 20).map((item, index) => {
      const title = item.title?.split(' - ')[0] || item.title || 'Market Update';
      const summary = item.contentSnippet || title;
      const category = determineCategory(title, summary);
      const ticker = extractTicker(title);
      
      // Mocking price change for the UI demo since standard RSS doesn't carry live ticks
      // In a real system, you'd match the ticker against your live Fyers cache here
      const mockChange = (Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1)).toFixed(2);
      
      return {
        id: `news-${index}`,
        title: title,
        summary: summary.length > 120 ? summary.substring(0, 120) + '...' : summary,
        ticker: ticker,
        price_change: `${parseFloat(mockChange) > 0 ? '+' : ''}${mockChange}%`,
        category: category,
        sector: 'General Market', // Can be expanded with a sector map
        timestamp: item.pubDate || new Date().toISOString(),
        source_url: item.link || '#'
      };
    });

    return NextResponse.json(newsItems);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    return NextResponse.json({ error: 'Failed to fetch news feed' }, { status: 500 });
  }
}
