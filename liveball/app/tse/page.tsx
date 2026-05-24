"use client";

import React, { useEffect, useState, useMemo } from "react";

const ROWS_PER_PAGE = 20;

type Player = {
  Name: string;
  GamesPlayed: number;
  PPP: number;
  RelativeTSE: number;
  PtsPer75: number;
  TruePointsPer75: number;
  ScoringTurnoversPer75: number;
};

type SortKey = keyof Player;
type SortDir = "asc" | "desc";

const PPPTable = () => {
  const [data, setData] = useState<Player[]>([]);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("PPP");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => {
        const cleanData = json.map((p: any) => ({
          Name: p.Name,
          GamesPlayed: Number(p.GamesPlayed),
          PPP: Number(p.PPP),
          RelativeTSE: Number(p.RelativeTSE),
          PtsPer75: Number(p.PtsPer75),
          TruePointsPer75: Number(p.TruePointsPer75),
          ScoringTurnoversPer75: Number(p.ScoringTurnoversPer75),
        }));
        setData(cleanData);
      })
      .catch(console.error);
  }, []);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "Name" ? "asc" : "desc");
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    let d = [...data];
    if (query) d = d.filter((p) => p.Name.toLowerCase().includes(query.toLowerCase()));
    d.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return d;
  }, [data, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);
  const minRelative = data.length ? Math.min(...data.map((d) => d.RelativeTSE)) : -1;
  const maxRelative = data.length ? Math.max(...data.map((d) => d.RelativeTSE)) : 1;

  const arrow = (key: SortKey) => (key === sortKey ? (sortDir === "asc" ? " ▲" : " ▼") : "");

  const relativeTSEStyle = (val: number): React.CSSProperties => {
    const t = (val - minRelative) / (maxRelative - minRelative);
    const r = Math.round(220 - t * 200);
    const g = Math.round(30 + t * 190);
    const b = 30;
    return { color: `rgb(${r}, ${g}, ${b})` };
  };

  if (!data.length)
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#9ca3af", fontFamily: "sans-serif" }}>
        Loading data...
      </div>
    );

  const columns: { key: SortKey; label: string }[] = [
    { key: "Name", label: "Player" },
    { key: "GamesPlayed", label: "GP" },
    { key: "PPP", label: "TSE" },
    { key: "RelativeTSE", label: "Relative TSE" },
    { key: "PtsPer75", label: "Pts/75" },
    { key: "TruePointsPer75", label: "True Pts/75" },
    { key: "ScoringTurnoversPer75", label: "Scoring TOV/75" },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 500, margin: 0, letterSpacing: "-0.3px" }}>TSE</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>
          TSE Explained In About Section
        </p>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ position: "relative", maxWidth: "300px" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "15px" }}>
            🔍
          </span>
          <input
            type="text"
            placeholder="Search player..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              fontSize: "14px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: "#fff",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div style={{ border: "1px solid #f3f4f6", borderRadius: "12px", overflowX: "auto", background: "#fff" }}>
        <table style={{ width: "100%", minWidth: "620px", borderCollapse: "collapse", fontSize: "14px", tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: "40px" }} />
            <col style={{ width: "26%" }} />
            <col style={{ width: "7%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "11%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "14%" }} />
          </colgroup>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th style={thStyle}>#</th>
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  style={{ ...thStyle, textAlign: key === "Name" ? "left" : "right", cursor: "pointer", color: sortKey === key ? "#111827" : "#9ca3af" }}
                  onClick={() => handleSort(key)}
                >
                  {label}{arrow(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
                  No players found
                </td>
              </tr>
            ) : (
              pageData.map((row, idx) => {
                const globalRank = page * ROWS_PER_PAGE + idx + 1;
                const relStyle = relativeTSEStyle(row.RelativeTSE);
                return (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...tdStyle, color: "#9ca3af", fontSize: "12px", fontFamily: "monospace" }}>{globalRank}</td>
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{row.Name}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: "monospace" }}>{row.GamesPlayed}</td>
                    <td style={{ ...tdStyle, textAlign: "right" }}>
<span style={{ fontFamily: "monospace", minWidth: "38px", textAlign: "right" }}>{row.PPP.toFixed(3)}</span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: "monospace", fontWeight: 500, ...relStyle }}>
                      {row.RelativeTSE > 0 ? "+" : ""}{row.RelativeTSE.toFixed(3)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: "monospace" }}>{row.PtsPer75.toFixed(1)}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: "monospace" }}>{row.TruePointsPer75.toFixed(1)}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontFamily: "monospace" }}>{row.ScoringTurnoversPer75.toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "1rem" }}>
        <span style={{ fontSize: "13px", color: "#9ca3af" }}>
          {filtered.length} players · page {page + 1} of {totalPages}
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: page === 0 ? "#f9fafb" : "#fff",
              color: page === 0 ? "#9ca3af" : "#374151",
              cursor: page === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              lineHeight: "1.5",
            }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            style={{
              padding: "6px 14px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              background: page >= totalPages - 1 ? "#f9fafb" : "#fff",
              color: page >= totalPages - 1 ? "#9ca3af" : "#374151",
              cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              lineHeight: "1.5",
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  padding: "11px 16px",
  textAlign: "left",
  fontWeight: 500,
  fontSize: "11px",
  color: "#9ca3af",
  borderBottom: "1px solid #f3f4f6",
  letterSpacing: "0",
  userSelect: "none",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderBottom: "1px solid #f9fafb",
  color: "#111827",
};

export default PPPTable;