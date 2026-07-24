import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.itspdfthings.com";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/llms.txt`, {
      next: { revalidate: 3600 },
    });
    const text = await res.text();
    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return new NextResponse("Failed to load llms.txt", { status: 500 });
  }
}
