import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Zayd Hassan — AI Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse at 20% 10%, rgba(139,92,246,0.35), transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(34,211,238,0.28), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(47,107,255,0.32), transparent 60%), #050505",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            letterSpacing: 6,
            color: "#a1a1aa",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "linear-gradient(135deg, #22d3ee, #a855f7)",
            }}
          />
          Zayd Hassan
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -2,
            display: "flex",
            maxWidth: 1000,
          }}
        >
          I Build Intelligent Digital Experiences.
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 30,
            color: "#a1a1aa",
            display: "flex",
          }}
        >
          AI Engineer · Full-Stack Developer · Automation Builder
        </div>
        <div
          style={{
            marginTop: 64,
            display: "flex",
            gap: 14,
          }}
        >
          {["Next.js", "FastAPI", "LLMs", "Three.js", "Automation"].map((t) => (
            <div
              key={t}
              style={{
                fontSize: 22,
                color: "#ededf0",
                padding: "8px 18px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}