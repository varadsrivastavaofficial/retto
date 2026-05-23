"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getOpportunities, deleteOpportunity } from "@/lib/firestore";
import { DUMMY_OPPORTUNITIES } from "@/lib/dummy-data";
import { CATEGORY_MAP } from "@/lib/categories";
import type { Opportunity } from "@/types";
import Footer from "@/components/layout/Footer";

export default function AdminDashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOpportunities({ limitCount: 100 });
      // Fallback to dummy data if Firestore is empty
      setOpportunities(data.length > 0 ? data : DUMMY_OPPORTUNITIES);
    } catch {
      setOpportunities(DUMMY_OPPORTUNITIES);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadOpportunities(); }, [loadOpportunities]);

  const filtered = opportunities.filter((o) =>
    o.title.toLowerCase().includes(search.toLowerCase()) ||
    o.organisation.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteOpportunity(id);
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      alert("Failed to delete. Try again.");
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const stats = {
    total: opportunities.length,
    trending: opportunities.filter((o) => o.isTrending).length,
    categories: new Set(opportunities.map((o) => o.category)).size,
  };

  return (
    <main style={{ minHeight: "calc(100vh - 100px)" }}>
      <div className="container-main" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
        {/* Page header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Admin Dashboard</h1>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Manage all opportunities on Retto</p>
          </div>
          <Link href="/admin/add" className="btn btn-primary" style={{ fontSize: "0.875rem" }} id="add-opportunity-button">
            + Add Opportunity
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Listings", value: stats.total },
            { label: "Trending", value: stats.trending },
            { label: "Categories Active", value: stats.categories },
          ].map(({ label, value }) => (
            <div key={label} className="card" style={{ padding: "1rem" }}>
              <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "var(--text)" }}>{value}</p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ marginBottom: "1rem" }}>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or organisation..."
            className="input"
            style={{ maxWidth: "400px" }}
            id="admin-search-input"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Loading opportunities...
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No opportunities found.</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto", border: "1px solid var(--border)" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Organisation</th>
                  <th>Category</th>
                  <th>Deadline</th>
                  <th>Trending</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((opp) => {
                  const cat = CATEGORY_MAP[opp.category];
                  return (
                    <tr key={opp.id}>
                      <td style={{ maxWidth: "240px" }}>
                        <p style={{ fontWeight: 600, fontSize: "0.82rem", color: "var(--text)", textTransform: "uppercase" }} className="truncate-2">
                          {opp.title}
                        </p>
                      </td>
                      <td style={{ fontSize: "0.82rem" }}>{opp.organisation}</td>
                      <td>
                        <span className="tag" style={{ fontSize: "0.65rem" }}>
                          {cat?.icon} {cat?.name}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.8rem", whiteSpace: "nowrap" }}>
                        {new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td style={{ textAlign: "center", fontSize: "0.875rem" }}>
                        {opp.isTrending ? "✓" : "—"}
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "0.375rem" }}>
                          <Link
                            href={`/opportunities/${opp.id}`}
                            className="btn btn-ghost"
                            style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                          >
                            View
                          </Link>
                          <Link
                            href={`/admin/edit/${opp.id}`}
                            className="btn btn-outline"
                            style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(opp.id, opp.title)}
                            disabled={deleting === opp.id}
                            className="btn btn-danger"
                            style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
                          >
                            {deleting === opp.id ? "..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
