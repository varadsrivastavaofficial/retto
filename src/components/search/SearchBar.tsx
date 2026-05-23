"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import type { CategorySlug } from "@/types";

interface Props {
  initialQuery?: string;
  initialCategory?: CategorySlug | "all";
  variant?: "hero" | "compact";
}

export default function SearchBar({ initialQuery = "", initialCategory = "all", variant = "compact" }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategorySlug | "all">(initialCategory);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("cat", category);
    router.push(`/search?${params.toString()}`);
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSearch}
      style={{
        display: "flex",
        gap: "0",
        border: "1px solid var(--border)",
        backgroundColor: "var(--bg)",
        maxWidth: isHero ? "640px" : "100%",
        width: "100%",
      }}
      role="search"
      aria-label="Search opportunities"
    >
      {/* Category selector */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as CategorySlug | "all")}
        className="input select"
        style={{
          width: isHero ? "160px" : "140px",
          flexShrink: 0,
          borderRight: "1px solid var(--border)",
          borderTop: "none",
          borderBottom: "none",
          borderLeft: "none",
          fontSize: "0.82rem",
        }}
        aria-label="Filter by category"
        id="search-category-filter"
      >
        <option value="all">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Query input with magnifying glass icon */}
      <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          style={{
            position: "absolute",
            left: "0.65rem",
            width: isHero ? "1.1rem" : "0.95rem",
            height: isHero ? "1.1rem" : "0.95rem",
            color: "var(--text-muted)",
            pointerEvents: "none",
            flexShrink: 0,
          }}
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isHero ? "Search internships, fellowships, research programs..." : "Search opportunities..."}
          className="input"
          style={{
            flex: 1,
            border: "none",
            fontSize: isHero ? "0.95rem" : "0.875rem",
            paddingLeft: isHero ? "2rem" : "1.9rem",
            width: "100%",
          }}
          aria-label="Search query"
          id="search-query-input"
          autoComplete="off"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="btn btn-primary"
        style={{
          flexShrink: 0,
          borderRadius: 0,
          fontSize: isHero ? "0.875rem" : "0.82rem",
          padding: isHero ? "0.6rem 1.25rem" : "0.5rem 0.875rem",
        }}
        id="search-submit-button"
      >
        Search
      </button>
    </form>
  );
}
