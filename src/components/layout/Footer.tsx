import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const linkStyle: React.CSSProperties = { fontSize: "0.82rem", color: "var(--text-secondary)" };

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        backgroundColor: "var(--bg-secondary)",
        padding: "2.5rem 0 1.5rem",
        marginTop: "3rem",
      }}
    >
      <div className="container-main">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <p
              style={{
                fontWeight: 700,
                fontSize: "1.1rem",
                marginBottom: "0.5rem",
                color: "var(--text)",
              }}
            >
              Retto
            </p>
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                lineHeight: 1.6,
              }}
            >
              The fastest way to discover internships, research programs, fellowships, and more — built for serious students.
            </p>
          </div>

          {/* Categories */}
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.75rem",
              }}
            >
              Categories
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {CATEGORIES.slice(0, 6).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="footer-link"
                  style={linkStyle}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.75rem",
              }}
            >
              More
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {CATEGORIES.slice(6).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/categories/${cat.slug}`}
                  className="footer-link"
                  style={linkStyle}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.75rem",
              }}
            >
              Platform
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {[
                { label: "Search", href: "/search" },
                { label: "Bookmarks", href: "/bookmarks" },
                { label: "Sign In", href: "/login" },
              ].map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="footer-link"
                  style={linkStyle}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* About / Disclaimer / License panel */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.75rem",
          }}
        >
          {/* About Us */}
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.6rem",
              }}
            >
              About Us
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              Retto is a student-first discovery platform that aggregates internships, research
              programs, fellowships, government schemes, and competitions from across India and
              abroad. Our mission is to make opportunity accessible — fast, minimal, and trustworthy.
            </p>
          </div>

          {/* Disclaimer */}
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.6rem",
              }}
            >
              Disclaimer
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              Retto is an independent aggregation platform and is <strong style={{ color: "var(--text)" }}>not</strong> affiliated
              with any listed organisation. Listing details, deadlines, and eligibility criteria are
              sourced from public information and may change without notice. Always verify details on
              the official programme website before applying. Retto accepts no liability for missed
              opportunities or inaccurate information.
            </p>
          </div>

          {/* License */}
          <div>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "0.6rem",
              }}
            >
              License
            </p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
              The Retto platform is released under the{" "}
              <a
                href="https://opensource.org/licenses/MIT"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={{ fontSize: "0.78rem", textDecoration: "underline" }}
              >
                MIT License
              </a>
              . You are free to use, copy, modify, and distribute this software provided the original
              copyright notice is retained. The opportunity data displayed is curated for informational
              purposes only and is not part of the open-source licence.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            © {currentYear} Retto. Built for college students.
          </p>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
            Fast. Minimal. Trustworthy.
          </p>
        </div>
      </div>
    </footer>
  );
}
