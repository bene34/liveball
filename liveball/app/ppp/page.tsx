"use client";

import React, { useEffect, useState } from "react";

const ROWS_PER_PAGE = 20;

type Player = {
  Name: string;
  GamesPlayed: number;
  Usage: number;
  PPP: number;
};

const PPP = () => {
  const [data, setData] = useState<Player[]>([]);
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<keyof Player>("PPP");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((json) => {
        // ensure numbers are numbers
        const cleanData = json.map((p: any) => ({
          Name: p.Name,
          GamesPlayed: Number(p.GamesPlayed),
          Usage: Number(p.Usage),
          PPP: Number(p.PPP),
        }));
        setData(cleanData);
      })
      .catch(console.error);
  }, []);

  if (!data.length) return <p className="p-8 text-center">Loading data...</p>;

  // sort before slicing
  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const start = page * ROWS_PER_PAGE;
  const end = start + ROWS_PER_PAGE;
  const pageData = sortedData.slice(start, end);
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

  const handleSort = (key: keyof Player) => {
    if (key === sortKey) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
    setPage(0); // reset page when changing sort
  };

  const getSortIndicator = (key: keyof Player) => (key === sortKey ? (sortOrder === "asc" ? "▲" : "▼") : "");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">Player PPP</h1>
      <p className="text-lg text-gray-600 mb-8 text-center">
        Points per possession (PPP) and usage across top NBA players.
      </p>

      <div className="overflow-x-auto shadow-md rounded-2xl border border-gray-200 bg-white">
        <table className="min-w-full text-base text-gray-900 border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {["Name", "GamesPlayed", "Usage", "PPP"].map((key) => (
                <th
                  key={key}
                  className="border-b px-6 py-4 text-center font-semibold cursor-pointer"
                  onClick={() => handleSort(key as keyof Player)}
                >
                  {key === "Name" ? "Player" : key === "GamesPlayed" ? "Games" : key === "Usage" ? "Usage %" : "PPP"}{" "}
                  {getSortIndicator(key as keyof Player)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row, idx) => (
              <tr key={idx} className={`hover:bg-blue-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                <td className="border-b px-6 py-3 font-medium text-left text-gray-800">{row.Name}</td>
                <td className="border-b px-6 py-3 text-center font-mono">{row.GamesPlayed}</td>
                <td className="border-b px-6 py-3 text-center font-mono">{row.Usage.toFixed(1)}</td>
                <td className="border-b px-6 py-3 text-center font-mono">{row.PPP.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          disabled={page === 0}
          className={`px-4 py-2 rounded-lg border ${page === 0 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100 border-gray-300"}`}
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page <strong>{page + 1}</strong> of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          disabled={page === totalPages - 1}
          className={`px-4 py-2 rounded-lg border ${page === totalPages - 1 ? "text-gray-400 border-gray-200 cursor-not-allowed" : "hover:bg-gray-100 border-gray-300"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PPP;
