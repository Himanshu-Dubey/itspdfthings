import { NextRequest, NextResponse } from "next/server";
import { getAllProgrammaticRoutes } from "@/lib/programmatic/catalog";

const SITE_URL = "https://itspdfthings.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "";

function getAllUrls(): string[] {
  const staticPages = [
    "",
    "pricing",
    "privacy",
    "terms",
    "about",
    "contact",
    "blog",
  ];
  const toolPages = [
    "merge-pdf",
    "split-pdf",
    "compress-pdf",
    "organize-pdf",
    "image-to-pdf",
    "pdf-to-image",
    "watermark-pdf",
    "page-numbers",
    "protect-pdf",
  ];
  const programmatic = getAllProgrammaticRoutes().map(
    ({ tool, variant }) => `${tool}/${variant}`,
  );
  return [
    ...staticPages,
    ...toolPages,
    ...programmatic,
  ].map((path) => `${SITE_URL}/${path}`);
}

async function submitToIndexNow(urls: string[]): Promise<{
  ok: boolean;
  status: number;
  body: string;
}> {
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "itspdfthings.com",
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

export async function GET(req: NextRequest) {
  if (!INDEXNOW_KEY) {
    return NextResponse.json(
      { error: "INDEXNOW_KEY not set in environment" },
      { status: 500 },
    );
  }

  const allUrls = getAllUrls();
  const result = await submitToIndexNow(allUrls);

  return NextResponse.json({
    submitted: allUrls.length,
    host: "itspdfthings.com",
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    indexnow: result,
  });
}

export async function POST(req: NextRequest) {
  if (!INDEXNOW_KEY) {
    return NextResponse.json(
      { error: "INDEXNOW_KEY not set in environment" },
      { status: 500 },
    );
  }

  const body = await req.json().catch(() => null);
  const urls: string[] | null = body?.urls ?? null;

  const urlList = urls?.length
    ? urls
    : getAllUrls();

  const result = await submitToIndexNow(urlList);

  return NextResponse.json({
    submitted: urlList.length,
    indexnow: result,
  });
}
