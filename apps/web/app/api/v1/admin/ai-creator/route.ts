import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ success: false, error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.NVIDIA_API_KEY) {
      return NextResponse.json({ success: false, error: 'NVIDIA API key is not configured.' }, { status: 500 });
    }

    const systemPrompt = `
      You are an elite quantitative researcher and algorithmic trading expert.
      The user will provide a high-level trading idea or a set of indicators.
      Your job is to generate a fully fleshed-out trading strategy based on their prompt.
      
      You must respond ONLY with a valid JSON object matching this schema, without any markdown formatting or backticks around it:
      {
        "name": "A catchy name for the strategy",
        "description": "A 2-sentence description of the logic",
        "classification": "black_box" | "white_box",
        "min_capital": number (e.g., 50000, 100000),
        "expected_cagr": number (e.g., 25.5, 42.0),
        "expected_win_rate": number (between 50 and 95),
        "expected_max_drawdown": number (e.g., 5.5, 12.0),
        "logic": {
          "indicators": ["List of indicators used"],
          "entry_rules": ["Rule 1", "Rule 2"],
          "exit_rules": ["Rule 1", "Rule 2"],
          "stop_loss_pct": number,
          "take_profit_pct": number
        }
      }
      
      Aim for strategies that could theoretically achieve a high strike rate (e.g. around 80-90%) by combining confirming indicators (like RSI divergence + Bollinger Band squeeze + Volume confirmation).
    `;

    const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API Error:", errorText);
      return NextResponse.json({ success: false, error: 'NVIDIA API request failed.' }, { status: response.status });
    }

    const result = await response.json();
    let textResult = result.choices[0].message.content;
    
    // Clean up if it returned markdown
    if (textResult.startsWith('```json')) {
      textResult = textResult.replace(/```json/g, '').replace(/```/g, '');
    }

    try {
      const strategyData = JSON.parse(textResult);
      return NextResponse.json({ success: true, data: strategyData });
    } catch (parseError) {
      console.error("Failed to parse NVIDIA output:", textResult);
      return NextResponse.json({ success: false, error: 'AI returned invalid format.' }, { status: 500 });
    }

  } catch (error: any) {
    console.error("AI Strategy Generation Error:", error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to generate strategy' }, { status: 500 });
  }
}
