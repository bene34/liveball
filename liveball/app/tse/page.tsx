"use client";

import React, { useEffect, useState, useMemo } from "react";

const ROWS_PER_PAGE = 20;

const normalize = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

type Player = {
  Name: string;
  Season: string;
  GamesPlayed: number;
  PPP: number;
  RelativeTSE: number;
  PtsPer75: number;
  TruePointsPer75: number;
  ScoringTurnoversPer75: number;
  Minutes: number;
  TrueScoringPossessionsPer75: number;
  TSEAddPer75: number;
};

type SortKey = keyof Player;
type SortDir = "asc" | "desc";

const PPPTable = () => {
  const [data, setData] = useState<Player[]>([]);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("PPP");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [query, setQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("2025-26");
  const [minFilters, setMinFilters] = useState<Partial<Record<SortKey, string>>>({});

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => {
        const cleanData = json.map((p: any) => ({
          Name: p.Name,
          Season: p.Season,
          GamesPlayed: Number(p.GamesPlayed),
          PPP: Number(p.PPP),
          RelativeTSE: Number(p.RelativeTSE),
          PtsPer75: Number(p.PtsPer75),
          TruePointsPer75: Number(p.TruePointsPer75),
          ScoringTurnoversPer75: Number(p.ScoringTurnoversPer75),
          Minutes: Number(p.Minutes),
          TrueScoringPossessionsPer75: Number(p.TrueScoringPossessionsPer75),
          TSEAddPer75: Number(p.TSEAddPer75),
        }));
        setData(cleanData);
      })
      .catch(console.error);
  }, []);

  const seasons = useMemo(() => {
    const s = Array.from(new Set(data.map((d) => d.Season))).sort().reverse();
    return s;
  }, [data]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "Name" || key === "Season" ? "asc" : "desc");
    }
    setPage(0);
  };

  const filtered = useMemo(() => {
    let d = [...data];
    if (selectedSeason !== "all") d = d.filter((p) => p.Season === selectedSeason);
    if (query) d = d.filter((p) => normalize(p.Name.toLowerCase()).includes(normalize(query.toLowerCase())));
    Object.entries(minFilters).forEach(([key, val]) => {
      if (val !== "" && val !== undefined) {
        const num = parseFloat(val);
        if (!isNaN(num)) d = d.filter((p) => (p[key as SortKey] as number) >= num);
      }
    });
    d.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return d;
  }, [data, query, sortKey, sortDir, selectedSeason, minFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const pageData = filtered.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const arrow = (key: SortKey) => (key === sortKey ? (sortDir === "asc" ? " ▲" : " ▼") : "");

  const relativeTSEStyle = (val: number): React.CSSProperties => {
    const clamped = Math.max(-26, Math.min(26, val));
    const t = (clamped + 26) / 52;
    const r = Math.round(255 - t * 255);
    const g = Math.round(0 + t * 200);
    const b = 0;
    return { color: `rgb(${r}, ${g}, ${b})` };
  };

  const tseAddStyle = (val: number): React.CSSProperties => {
    const clamped = Math.max(-3.2, Math.min(3.2, val));
    const t = (clamped + 3.2) / 6.4;
    const r = Math.round(30 + t * 225); 
    const g = Math.round(144 + t * 19);   
    const b = Math.round(255 - t * 255);
    return { color: `rgb(${r}, ${g}, ${b})` };
  };

  const updateMinFilter = (key: SortKey, val: string) => {
    setMinFilters((prev) => ({ ...prev, [key]: val }));
    setPage(0);
  };

  if (!data.length)
    return (
      <div style={{ padding: "4rem", textAlign: "center", color: "#9ca3af", fontFamily: "sans-serif" }}>
        Loading data...
      </div>
    );

  const columns: { key: SortKey; label: string; numeric: boolean }[] = [
    { key: "Season", label: "Season", numeric: false },
    { key: "Name", label: "Player", numeric: false },
    { key: "Minutes", label: "Minutes", numeric: true },
    { key: "GamesPlayed", label: "GP", numeric: true },
    { key: "PPP", label: "TSE", numeric: true },
    { key: "RelativeTSE", label: "Relative TSE", numeric: true },
    { key: "TSEAddPer75", label: "TSE Add / 75", numeric: true },
    { key: "PtsPer75", label: "Points / 75", numeric: true },
    { key: "TruePointsPer75", label: "True Points / 75", numeric: true },
    { key: "TrueScoringPossessionsPer75", label: "True Scoring Possessions Used / 75", numeric: true },
    { key: "ScoringTurnoversPer75", label: "Scoring TOV / 75", numeric: true },
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 500, margin: 0, letterSpacing: "-0.3px" }}>TSE</h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "4px" }}>TSE Explained In About Section</p>
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: "15px" }}>🔍</span>
          <input
            type="text"
            placeholder="Search player..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            style={{ padding: "8px 12px 8px 32px", fontSize: "14px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontFamily: "inherit", color: "#111827", width: "200px" }}
          />
        </div>

        <select
          value={selectedSeason}
          onChange={(e) => { setSelectedSeason(e.target.value); setPage(0); }}
          style={{ padding: "8px 12px", fontSize: "14px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", fontFamily: "inherit", color: "#111827", cursor: "pointer" }}
        >
          <option value="all">All Seasons</option>
          {seasons.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div style={{ border: "1px solid #f3f4f6", borderRadius: "12px", overflowX: "auto", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead style={{ background: "#f9fafb" }}>
            <tr>
              <th style={thStyle}>#</th>
              {columns.map(({ key, label, numeric }) => (
                <th
                  key={key}
                  style={{ ...thStyle, textAlign: numeric ? "right" : "left", cursor: "pointer", color: sortKey === key ? "#111827" : "#9ca3af" }}
                  onClick={() => handleSort(key)}
                >
                  {label}{arrow(key)}
                </th>
              ))}
            </tr>
            <tr style={{ background: "#f9fafb" }}>
              <td style={{ padding: "4px 8px" }} />
              {columns.map(({ key, numeric }) => (
                <td key={key} style={{ padding: "4px 8px" }}>
                  {numeric && (
                    <input
                      type="number"
                      placeholder="min"
                      value={minFilters[key] ?? ""}
                      onChange={(e) => updateMinFilter(key, e.target.value)}
                      style={{ width: "100%", padding: "3px 6px", fontSize: "11px", borderRadius: "5px", border: "1px solid #e5e7eb", fontFamily: "inherit", color: "#374151", background: "#fff", textAlign: "right", boxSizing: "border-box" }}
                    />
                  )}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ padding: "3rem", textAlign: "center", color: "#9ca3af" }}>
                  No players found
                </td>
              </tr>
            ) : (
              pageData.map((row, idx) => {
                const globalRank = page * ROWS_PER_PAGE + idx + 1;
                return (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...tdStyle, color: "#9ca3af", fontSize: "12px", fontFamily: "monospace" }}>{globalRank}</td>
                    {columns.map(({ key, numeric }) => {
                      const val = row[key];
                      let display: string;
                      if (!numeric) display = String(val);
                      else if (key === "GamesPlayed" || key === "Minutes") display = String(Math.round(val as number));
                      else if (key === "RelativeTSE") display = `${(val as number) > 0 ? "+" : ""}${(val as number).toFixed(3)}`;
                      else if (key === "ScoringTurnoversPer75") display = (val as number).toFixed(2);
                      else display = (val as number).toFixed(3);

                      return (
                        <td
                          key={key}
                          style={{
                            ...tdStyle,
                            textAlign: numeric ? "right" : "left",
                            fontFamily: numeric ? "monospace" : "inherit",
                            fontWeight: key === "Name" ? 500 : undefined,
                            whiteSpace: key === "Season" ? "nowrap" : undefined,
                            ...(key === "RelativeTSE" ? relativeTSEStyle(row.RelativeTSE) : {}),
                            ...(key === "TSEAddPer75" ? tseAddStyle(row.TSEAddPer75) : {}),
                          }}
                        >
                          {display}
                        </td>
                      );
                    })}
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
            style={{ padding: "6px 14px", fontSize: "13px", borderRadius: "8px", border: "1px solid #e5e7eb", background: page === 0 ? "#f9fafb" : "#fff", color: page === 0 ? "#9ca3af" : "#374151", cursor: page === 0 ? "not-allowed" : "pointer", fontFamily: "inherit" }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={page >= totalPages - 1}
            style={{ padding: "6px 14px", fontSize: "13px", borderRadius: "8px", border: "1px solid #e5e7eb", background: page >= totalPages - 1 ? "#f9fafb" : "#fff", color: page >= totalPages - 1 ? "#9ca3af" : "#374151", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontFamily: "inherit" }}
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
  fontWeight: 500,
  fontSize: "11px",
  color: "#9ca3af",
  borderBottom: "1px solid #f3f4f6",
  userSelect: "none",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderBottom: "1px solid #f9fafb",
  color: "#111827",
};

export default PPPTable;