import { NextResponse } from "next/server";

const AI_ENGINE_URL = process.env.AI_ENGINE_URL || "http://localhost:8000";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");
    const resolution = searchParams.get("resolution");
    const range_from = searchParams.get("range_from");
    const range_to = searchParams.get("range_to");

    if (!symbol || !resolution || !range_from || !range_to) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const response = await fetch(
      `${AI_ENGINE_URL}/api/v1/market/history?symbol=${symbol}&resolution=${resolution}&range_from=${range_from}&range_to=${range_to}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `AI Engine Error: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Market History Route Error:", error);
    return NextResponse.json(
      { error: "Failed to connect to the AI engine." },
      { status: 500 }
    );
  }
}
