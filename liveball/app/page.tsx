import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
      <h1 style={{ fontSize: "clamp(28px, 8vw, 42px)", fontWeight: 500, color: "#111827", margin: 0, letterSpacing: "-0.5px", textAlign: "center" }}>
        HoopsDunker32
      </h1>
      <p style={{ fontSize: "16px", color: "#6b7280", marginTop: "12px", marginBottom: "2.5rem", textAlign: "center" }}>
        NBA Formulas 
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center", width: "100%", maxWidth: "500px" }}>
        <Link href="/tse" style={cardStyle}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>TSE</span>
          <span style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>True Scoring Efficiency</span>
        </Link>
        <Link href="/playmaking" style={cardStyle}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>Playmaking</span>
          <span style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Coming June 2026</span>
        </Link>
        <Link href="/about" style={cardStyle}>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#111827" }}>About</span>
          <span style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Stat Explainers</span>
        </Link>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  padding: "16px 20px",
  borderRadius: "12px",
  border: "1px solid #f3f4f6",
  background: "#fff",
  textDecoration: "none",
  minWidth: "140px",
  flex: "1 1 140px",
  cursor: "pointer",
};