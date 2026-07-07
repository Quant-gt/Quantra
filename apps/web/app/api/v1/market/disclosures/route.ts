import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const url = 'https://finance.yahoo.com/rss/headline?s=RELIANCE.NS,TCS.NS,HDFCBANK.NS,INFY.NS';
    const response = await fetch(url, { next: { revalidate: 300 } });
    let items = [];
    
    if (response.ok) {
      const xml = await response.text();
      const matches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
      for (const match of matches) {
        const content = match[1] || '';
        const titleMatch = content.match(/<title>(.*?)<\/title>/);
        const dateMatch = content.match(/<pubDate>(.*?)<\/pubDate>/);
        const descriptionMatch = content.match(/<description>([\s\S]*?)<\/description>/);
        
        if (titleMatch?.[1]) {
          const date = dateMatch?.[1] ? new Date(dateMatch[1]) : new Date();
          const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
          
          let ticker = 'MARKET';
          if (content.includes('RELIANCE')) ticker = 'RELIANCE';
          else if (content.includes('TCS')) ticker = 'TCS';
          else if (content.includes('HDFCBANK')) ticker = 'HDFCBANK';
          else if (content.includes('INFY')) ticker = 'INFY';

          items.push({
            time: timeStr,
            exchange: 'NSE',
            ticker,
            type: content.includes('Earnings') || titleMatch[1].includes('Quarter') ? 'Earnings' : 'Corporate Actions',
            title: titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1'),
            content: (descriptionMatch?.[1] || titleMatch[1]).replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').substring(0, 180) + '...'
          });
        }
      }
    }

    if (items.length === 0) {
      items = [
        { time: '09:15', exchange: 'NSE', ticker: 'RELIANCE', type: 'Corporate Actions', title: 'RIL initiates strategic clean energy pilot pipeline deployment.', content: 'Reliance Industries has announced the commissioning of its first clean energy facility in Gujarat, piloting solar-hydrogen integrations.' },
        { time: '10:30', exchange: 'NSE', ticker: 'INFY', type: 'Earnings', title: 'Infosys expands cloud AI capabilities with global enterprise clients.', content: 'Infosys announces completion of generative AI enterprise setups for European financial institutional clients.' }
      ];
    }

    return NextResponse.json({ success: true, disclosures: items.slice(0, 6) });
  } catch (error) {
    return NextResponse.json({ success: false, disclosures: [] });
  }
}
