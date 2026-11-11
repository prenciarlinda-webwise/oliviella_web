import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}, charcuterie and flower carts in Miami`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(60% 60% at 80% 10%, #f1cfd3 0%, #faf6ee 55%), radial-gradient(60% 60% at 10% 100%, #e7e9d6 0%, #faf6ee 55%)",
          color: "#515734",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 40,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#5f6640",
          }}
        >
          Miami
        </div>
        <div style={{ fontSize: 130, marginTop: 8 }}>{site.name}</div>
        <div
          style={{
            fontSize: 40,
            marginTop: 16,
            color: "#6c6a58",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Flower cart & charcuterie cart
        </div>
      </div>
    ),
    { ...size },
  );
}
