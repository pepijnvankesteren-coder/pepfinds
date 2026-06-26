import type { NextRequest } from "next/server";

/**
 * Image proxy for hotlink-protected Yupoo photos.
 *
 * Yupoo's `photo.yupoo.com` CDN returns an error page (HTTP 567) unless the
 * request carries a Yupoo `Referer`, so imported product images can't be
 * loaded straight from the browser. This route fetches them server-side with
 * the right referer and streams the bytes back from our own origin, which also
 * lets next/image optimize them. Stored image URLs point here:
 * `/api/img?u=<encoded yupoo url>`.
 *
 * Locked to yupoo.com hosts so it can't be abused as an open proxy.
 */

const ALLOWED_HOST = /(^|\.)yupoo\.com$/i;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("u");
  if (!raw) {
    return new Response("Missing url", { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return new Response("Bad url", { status: 400 });
  }

  if (target.protocol !== "https:" || !ALLOWED_HOST.test(target.hostname)) {
    return new Response("Forbidden host", { status: 403 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      headers: {
        "User-Agent": UA,
        // The referer that satisfies Yupoo's hotlink protection.
        Referer: `https://${target.hostname}/`,
        Accept: "image/avif,image/webp,image/*,*/*;q=0.8",
      },
      cache: "no-store",
    });
  } catch {
    return new Response("Upstream fetch failed", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "";
  // Yupoo serves its hotlink/error page as text/html — treat that as a miss.
  if (!upstream.ok || !contentType.startsWith("image/")) {
    return new Response("Image not available", { status: 502 });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      // Yupoo photo URLs are content-addressed, so cache hard.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
