import { ImageResponse } from "next/og";

/**
 * Default social-share image (1200×630), generated on the fly so no static
 * asset is needed. Referenced as the site-wide Open Graph / Twitter image in
 * the root layout; product pages override it with their own product photo.
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0a0a0b",
          padding: "84px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "92px",
              height: "92px",
              borderRadius: "22px",
              backgroundColor: "#ffffff",
              color: "#0a0a0b",
              fontSize: "58px",
              fontWeight: 700,
              marginRight: "28px",
            }}
          >
            P
          </div>
          <div style={{ fontSize: "76px", fontWeight: 700, color: "#ffffff" }}>
            PepFinds
          </div>
        </div>
        <div
          style={{
            fontSize: "40px",
            color: "#c7c7cc",
            marginTop: "44px",
            maxWidth: "920px",
            lineHeight: 1.3,
          }}
        >
          Curated finds direct from China — with direct links to trusted buying
          agents.
        </div>
        <div
          style={{
            fontSize: "26px",
            color: "#8e8e93",
            marginTop: "52px",
            letterSpacing: "3px",
          }}
        >
          WEIDIAN · TAOBAO · 1688
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "cache-control": "public, max-age=86400, immutable" },
    },
  );
}
