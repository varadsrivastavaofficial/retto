"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OpportunityCard from "@/components/opportunity/OpportunityCard";
import { useAuth } from "@/context/AuthContext";
import { getUserBookmarks, removeBookmark } from "@/lib/firestore";
import { DUMMY_OPPORTUNITIES } from "@/lib/dummy-data";
import type { Opportunity } from "@/types";

export default function BookmarksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookmarkedOpps, setBookmarkedOpps] = useState<Opportunity[]>([]);
  const [bookmarkIds, setBookmarkIds] = useState<Set<string>>(new Set());
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setFetching(true);
      try {
        const bms = await getUserBookmarks(user.uid);
        const ids = new Set(bms.map((b) => b.opportunityId));
        setBookmarkIds(ids);
        // In production: fetch from Firestore by IDs
        const opps = DUMMY_OPPORTUNITIES.filter((o) => ids.has(o.id));
        setBookmarkedOpps(opps);
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        setFetching(false);
      }
    };
    load();
  }, [user]);

  const handleRemoveBookmark = async (id: string) => {
    if (!user) return;
    await removeBookmark(user.uid, id);
    setBookmarkIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setBookmarkedOpps((prev) => prev.filter((o) => o.id !== id));
  };

  if (loading || fetching) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
          Loading...
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      <Navbar />
      <main>
        <section style={{ borderBottom: "1px solid var(--border)", padding: "2rem 0", backgroundColor: "var(--bg)" }}>
          <div className="container-main">
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>★ My Bookmarks</h1>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
              {bookmarkedOpps.length} saved opportunit{bookmarkedOpps.length === 1 ? "y" : "ies"}
            </p>
          </div>
        </section>

        <section style={{ padding: "2rem 0" }}>
          <div className="container-main">
            {bookmarkedOpps.length === 0 ? (
              <div className="empty-state">
                <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>☆</p>
                <p style={{ fontWeight: 700, marginBottom: "0.375rem" }}>No bookmarks yet</p>
                <p style={{ fontSize: "0.82rem", marginBottom: "1.25rem" }}>
                  Browse opportunities and click ☆ to save them here.
                </p>
                <a href="/search" className="btn btn-primary">Browse Opportunities →</a>
              </div>
            ) : (
              <div className="opportunity-grid">
                {bookmarkedOpps.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    showBookmarkButton
                    isBookmarked={bookmarkIds.has(opp.id)}
                    onBookmark={handleRemoveBookmark}
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
