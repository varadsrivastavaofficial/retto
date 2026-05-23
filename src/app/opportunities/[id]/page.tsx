import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import OpportunityCard from "@/components/opportunity/OpportunityCard";
import { DUMMY_OPPORTUNITIES } from "@/lib/dummy-data";
import { CATEGORY_MAP } from "@/lib/categories";
import { getSimilarOpportunities } from "@/lib/ai";
import { parseISO } from "date-fns";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return DUMMY_OPPORTUNITIES.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const opp = DUMMY_OPPORTUNITIES.find((o) => o.id === id);
  if (!opp) return { title: "Opportunity Not Found" };
  return {
    title: opp.title.toUpperCase(),
    description: opp.subtitle,
  };
}

export const revalidate = 3600;

export default async function OpportunityDetailPage({ params }: Props) {
  const { id } = await params;
  // In production: replace with Firestore getOpportunityById(id)
  const opp = DUMMY_OPPORTUNITIES.find((o) => o.id === id);
  if (!opp) notFound();

  const cat = CATEGORY_MAP[opp.category];
  const similar = getSimilarOpportunities(opp, DUMMY_OPPORTUNITIES, 3);

  let deadlineLabel = opp.deadline;
  let deadlineUrgent = false;
  try {
    const deadlineDate = parseISO(opp.deadline);
    const diff = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff < 0) {
      deadlineLabel = "Applications Closed";
    } else if (diff <= 7) {
      deadlineLabel = `${diff} day${diff === 1 ? "" : "s"} left — ${deadlineDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`;
      deadlineUrgent = true;
    } else {
      deadlineLabel = deadlineDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    }
  } catch { /* ignore */ }

  return (
    <>
      <Navbar />
      <main>
        <div className="container-main" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              <Link href="/" style={{ color: "var(--text-muted)" }}>Home</Link>
              {" / "}
              <Link href={`/categories/${opp.category}`} style={{ color: "var(--text-muted)" }}>{cat?.name}</Link>
              {" / "}
              <span style={{ color: "var(--text)" }}>{opp.title.length > 40 ? opp.title.slice(0, 40) + "…" : opp.title}</span>
            </p>
          </nav>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
            {/* Main content */}
            <div style={{ maxWidth: "760px" }}>
              {/* Category + badges */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                <span className="tag tag-accent">{cat?.icon} {cat?.name}</span>
                {opp.isTrending && (
                  <span className="tag" style={{ borderColor: "#d97706", color: "#d97706" }}>↑ Trending</span>
                )}
              </div>

              {/* Title */}
              <h1
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.875rem)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  lineHeight: 1.2,
                  marginBottom: "0.5rem",
                  color: "var(--text)",
                }}
              >
                {opp.title}
              </h1>

              {/* Organisation */}
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontWeight: 600, marginBottom: "0.375rem" }}>
                {opp.organisation}
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                {opp.subtitle}
              </p>

              {/* Key info grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "0",
                  border: "1px solid var(--border)",
                  marginBottom: "2rem",
                }}
              >
                {[
                  { label: "Deadline", value: deadlineLabel, urgent: deadlineUrgent },
                  { label: "Category", value: `${cat?.icon} ${cat?.name}` },
                  { label: "Posted", value: new Date(opp.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
                ].map(({ label, value, urgent }) => (
                  <div
                    key={label}
                    style={{
                      padding: "0.875rem 1rem",
                      borderRight: "1px solid var(--border)",
                    }}
                  >
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.25rem" }}>
                      {label}
                    </p>
                    <p style={{ fontSize: "0.875rem", fontWeight: 600, color: urgent ? "var(--danger)" : "var(--text)" }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Apply button */}
              <a
                href={opp.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ fontSize: "0.95rem", padding: "0.75rem 2rem", marginBottom: "2rem", display: "inline-flex" }}
                id="apply-button"
              >
                Apply Now →
              </a>

              <hr className="divider" />

              {/* Eligibility */}
              <section aria-label="Eligibility">
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Eligibility</h2>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>{opp.eligibility}</p>
              </section>

              <hr className="divider" />

              {/* Description */}
              <section aria-label="About this opportunity">
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>About this Opportunity</h2>
                <div
                  className="prose"
                  dangerouslySetInnerHTML={{ __html: opp.description }}
                />
              </section>

              <hr className="divider" />

              {/* Tags */}
              <section aria-label="Tags">
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" }}>Tags</h2>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {opp.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?q=${encodeURIComponent(tag)}`}
                      className="tag"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </section>

              <hr className="divider" />

              {/* Apply again */}
              <div style={{ padding: "1.5rem", border: "1px solid var(--border)", backgroundColor: "var(--bg-secondary)" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.5rem" }}>Ready to Apply?</h2>
                <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                  Deadline: <strong style={{ color: deadlineUrgent ? "var(--danger)" : "var(--text)" }}>{deadlineLabel}</strong>
                </p>
                <a
                  href={opp.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ fontSize: "0.875rem" }}
                  id="apply-button-bottom"
                >
                  Go to Application →
                </a>
              </div>
            </div>
          </div>

          {/* Similar opportunities */}
          {similar.length > 0 && (
            <section style={{ marginTop: "3rem" }}>
              <h2 className="section-title">Similar Opportunities</h2>
              <div className="opportunity-grid">
                {similar.map((s) => (
                  <OpportunityCard key={s.id} opportunity={s} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
