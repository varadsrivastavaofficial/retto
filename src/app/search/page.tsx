"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OpportunityCard from "@/components/opportunity/OpportunityCard";
import SearchBar from "@/components/search/SearchBar";
import { DUMMY_OPPORTUNITIES } from "@/lib/dummy-data";
import { CATEGORIES } from "@/lib/categories";
import { searchOpportunities } from "@/lib/ai";
import { useAuth } from "@/context/AuthContext";
import { addBookmark, removeBookmark, isBookmarked } from "@/lib/firestore";
import type { CategorySlug, SortOrder } from "@/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const initialQuery = searchParams.get("q") ?? "";
  const initialCat = (searchParams.get("cat") ?? "all") as CategorySlug | "all";
  const initialSort = (searchParams.get("sort") ?? "newest") as SortOrder;

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<CategorySlug | "all">(initialCat);
  const [sort, setSort] = useState<SortOrder>(initialSort);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  // Run search
  const rawResults = searchOpportunities(DUMMY_OPPORTUNITIES, query, category);
  let results = rawResults.map((r) => r.opportunity);

  // Sort
  if (sort === "deadline") {
    results = [...results].sort((a, b) =>
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  } else if (sort === "trending") {
    results = [...results].sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
  }

  // Load bookmarks
  useEffect(() => {
    if (!user) return;
    const checkBookmarks = async () => {
      const states: Set<string> = new Set();
      await Promise.all(
        results.map(async (opp) => {
          const bm = await isBookmarked(user.uid, opp.id);
          if (bm) states.add(opp.id);
        })
      );
      setBookmarks(states);
    };
    checkBookmarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleBookmark = useCallback(async (id: string) => {
    if (!user) { router.push("/login"); return; }
    if (bookmarks.has(id)) {
      await removeBookmark(user.uid, id);
      setBookmarks((prev) => { const n = new Set(prev); n.delete(id); return n; });
    } else {
      await addBookmark(user.uid, id);
      setBookmarks((prev) => new Set(prev).add(id));
    }
  }, [user, bookmarks, router]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (category !== "all") params.set("cat", category);
    if (sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    router.replace(`/search${qs ? `?${qs}` : ""}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, sort]);

  return (
    <>
      <Navbar />
      <main>
        {/* Search header */}
        <section style={{ borderBottom: "1px solid var(--border)", padding: "2rem 0", backgroundColor: "var(--bg)" }}>
          <div className="container-main">
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Search Opportunities</h1>
            <SearchBar initialQuery={query} initialCategory={category} />
          </div>
        </section>

        {/* Filter bar */}
        <div style={{ borderBottom: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)", padding: "0.75rem 0" }}>
          <div className="container-main" style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", alignItems: "center" }}>
            {/* Category pills */}
            <button
              className={`cat-pill ${category === "all" ? "active" : ""}`}
              onClick={() => setCategory("all")}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                className={`cat-pill ${category === cat.slug ? "active" : ""}`}
                onClick={() => setCategory(cat.slug)}
              >
                {cat.icon} {cat.name}
              </button>
            ))}

            {/* Sort */}
            <div style={{ marginLeft: "auto", position: "relative", display: "inline-flex", alignItems: "center" }}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOrder)}
                className="input select"
                style={{
                  fontSize: "0.8rem",
                  padding: "0.3rem 2.1rem 0.3rem 0.625rem",
                  width: "auto",
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  cursor: "pointer",
                  paddingRight: "2.1rem",
                }}
                aria-label="Sort results"
                id="sort-select"
              >
                <option value="newest">Newest First</option>
                <option value="deadline">Deadline Soon</option>
                <option value="trending">Trending</option>
              </select>
              {/* Down arrow icon */}
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                style={{
                  position: "absolute",
                  right: "0.55rem",
                  width: "0.9rem",
                  height: "0.9rem",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Results */}
        <section style={{ padding: "2rem 0" }}>
          <div className="container-main">
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              {results.length} result{results.length !== 1 ? "s" : ""}
              {query && <> for &ldquo;<strong style={{ color: "var(--text)" }}>{query}</strong>&rdquo;</>}
              {category !== "all" && <> in <strong style={{ color: "var(--text)" }}>{CATEGORIES.find(c => c.slug === category)?.name}</strong></>}
            </p>

            {results.length === 0 ? (
              <div className="empty-state">
                <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🔍</p>
                <p style={{ fontWeight: 700, marginBottom: "0.375rem" }}>No results found</p>
                <p style={{ fontSize: "0.82rem" }}>Try different keywords or select a different category.</p>
              </div>
            ) : (
              <div className="opportunity-grid">
                {results.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    showBookmarkButton
                    isBookmarked={bookmarks.has(opp.id)}
                    onBookmark={handleBookmark}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
