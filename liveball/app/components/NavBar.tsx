import React from "react";
import Link from "next/link";

const NavBar = () => {
  return (
    <div style={{ width: "100%", borderBottom: "1px solid #f3f4f6", background: "#fff" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "56px" }}>
        <Link href="/" style={{ fontSize: "15px", fontWeight: 500, color: "#111827", fontFamily: "system-ui, sans-serif", textDecoration: "none" }}>
          HoopsDunker32
        </Link>
        <div style={{ display: "flex", gap: "4px", fontFamily: "system-ui, sans-serif" }}>
          <Link href="/tse" style={navLinkStyle}>
            TSE
          </Link>
          <Link href="/playmaking" style={navLinkStyle}>Playmaking</Link>
          <Link href="/about" style={navLinkStyle}>About</Link>
        </div>
      </div>
    </div>
  );
};

const navLinkStyle: React.CSSProperties = {
  padding: "6px 12px",
  fontSize: "14px",
  color: "#6b7280",
  borderRadius: "8px",
  cursor: "pointer",
  textDecoration: "none",
  transition: "background 0.15s, color 0.15s",
};

export default NavBar;