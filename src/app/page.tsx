import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchBar from "@/components/search/SearchBar";
import OpportunityCard from "@/components/opportunity/OpportunityCard";
import { CATEGORIES } from "@/lib/categories";
import { DUMMY_OPPORTUNITIES } from "@/lib/dummy-data";

export const metadata: Metadata = {
  title: "Retto — Opportunities for College Students",
  description: "Discover internships, research fellowships, scholarships, hackathons, and more — curated for serious college students.",
};

export const revalidate = 3600; // ISR: revalidate every hour

export default function HomePage() {
  const trending = DUMMY_OPPORTUNITIES.filter((o) => o.isTrending).slice(0, 6);
  const recent = DUMMY_OPPORTUNITIES.slice(0, 6);

  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ───────────────────────────────────────────────── */}
        <section
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "3.5rem 0 3rem",
            backgroundColor: "var(--bg)",
          }}
          aria-label="Hero section"
        >
          <div className="container-main" style={{ maxWidth: "700px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.25rem 0.625rem",
                border: "1px solid var(--border)",
                marginBottom: "1.25rem",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
              }}
            >
              <span>●</span> Live opportunities updated daily
            </div>

            <h1
              style={{
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: "1rem",
                color: "var(--text)",
              }}
            >
              Discover Opportunities
              <br />
              <span style={{ color: "var(--text-secondary)" }}>Built for Serious Students</span>
            </h1>

            <p
              style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                marginBottom: "2rem",
                lineHeight: 1.65,
                maxWidth: "520px",
              }}
            >
              Internships, research programs, fellowships, hackathons, and scholarships — all in one clean, fast platform.
            </p>

            <SearchBar variant="hero" />

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: "2rem",
                marginTop: "2rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { value: "15+", label: "Opportunities" },
                { value: "11", label: "Categories" },
                { value: "Free", label: "Always" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text)" }}>{value}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ──────────────────────────────────────────── */}
        <section style={{ padding: "2.5rem 0", borderBottom: "1px solid var(--border)" }} aria-label="Browse categories">
          <div className="container-main">
            <h2 className="section-title">Browse by Category</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="card"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    padding: "1rem 0.75rem",
                    gap: "0.5rem",
                    textDecoration: "none",
                  }}
                  aria-label={`Browse ${cat.name} opportunities`}
                >
                  <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text)" }}>{cat.name}</span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                    {cat.description.split(".")[0]}.
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trending ────────────────────────────────────────────── */}
        <section style={{ padding: "2.5rem 0", borderBottom: "1px solid var(--border)" }} aria-label="Trending opportunities">
          <div className="container-main">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className="section-title" style={{ marginBottom: 0, border: 0, paddingBottom: 0 }}>
                ↑ Trending Now
              </h2>
              <Link href="/search?sort=trending" className="text-link">
                View all →
              </Link>
            </div>
            <div className="opportunity-grid">
              {trending.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Recent ──────────────────────────────────────────────── */}
        <section style={{ padding: "2.5rem 0" }} aria-label="Recent opportunities">
          <div className="container-main">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 className="section-title" style={{ marginBottom: 0, border: 0, paddingBottom: 0 }}>
                Recently Added
              </h2>
              <Link href="/search" className="text-link">
                View all →
              </Link>
            </div>
            <div className="opportunity-grid">
              {recent.map((opp) => (
                <OpportunityCard key={opp.id} opportunity={opp} />
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────── */}
        <section
          style={{
            borderTop: "1px solid var(--border)",
            padding: "3rem 0",
            backgroundColor: "var(--bg-secondary)",
          }}
          aria-label="Sign up call to action"
        >
          <div className="container-main" style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
              Never Miss an Opportunity
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
              Sign in to bookmark opportunities and get personalised recommendations.
            </p>
            <Link href="/login" className="btn btn-primary" style={{ fontSize: "0.9rem", padding: "0.625rem 1.5rem" }} id="cta-signin-button">
              Sign In with Google →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
