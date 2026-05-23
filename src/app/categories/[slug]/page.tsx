import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OpportunityCard from "@/components/opportunity/OpportunityCard";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import { DUMMY_OPPORTUNITIES } from "@/lib/dummy-data";
import type { CategorySlug } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_MAP[slug];
  if (!cat) return { title: "Category Not Found" };
  return {
    title: `${cat.name} Opportunities`,
    description: `Browse ${cat.name} internships, fellowships, and research programs for college students.`,
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cat = CATEGORY_MAP[slug as CategorySlug];
  if (!cat) notFound();

  // In production, replace with Firestore query
  const opportunities = DUMMY_OPPORTUNITIES.filter((o) => o.category === slug);

  return (
    <>
      <Navbar />
      <main>
        {/* Category header */}
        <section
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "2.5rem 0 2rem",
            backgroundColor: "var(--bg)",
          }}
        >
          <div className="container-main">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <a href="/" style={{ color: "var(--text-muted)" }}>Home</a>
                {" / "}
                <a href="/search" style={{ color: "var(--text-muted)" }}>Opportunities</a>
                {" / "}
                <span style={{ color: "var(--text)" }}>{cat.name}</span>
              </p>
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.625rem" }}>
              <span style={{ fontSize: "2rem" }}>{cat.icon}</span>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 700 }}>{cat.name}</h1>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", maxWidth: "480px" }}>
              {cat.description}
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              {opportunities.length} opportunit{opportunities.length === 1 ? "y" : "ies"} listed
            </p>
          </div>
        </section>

        {/* All categories strip */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            overflowX: "auto",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div
            className="container-main"
            style={{ display: "flex", gap: "0.5rem", padding: "0.75rem 1rem", flexWrap: "nowrap", minWidth: "max-content" }}
          >
            {CATEGORIES.map((c) => (
              <a
                key={c.slug}
                href={`/categories/${c.slug}`}
                className={`cat-pill ${c.slug === slug ? "active" : ""}`}
              >
                {c.icon} {c.name}
              </a>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <section style={{ padding: "2rem 0" }}>
          <div className="container-main">
            {opportunities.length === 0 ? (
              <div className="empty-state">
                <p style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{cat.icon}</p>
                <p style={{ fontWeight: 700, marginBottom: "0.375rem" }}>No {cat.name} opportunities yet</p>
                <p style={{ fontSize: "0.82rem" }}>Check back soon — we add new listings daily.</p>
              </div>
            ) : (
              <div className="opportunity-grid">
                {opportunities.map((opp) => (
                  <OpportunityCard key={opp.id} opportunity={opp} />
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
