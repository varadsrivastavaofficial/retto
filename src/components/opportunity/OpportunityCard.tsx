"use client";

import Link from "next/link";
import type { Opportunity } from "@/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatDistanceToNow, parseISO, isPast } from "date-fns";

interface Props {
  opportunity: Opportunity;
  showBookmarkButton?: boolean;
  isBookmarked?: boolean;
  onBookmark?: (id: string) => void;
}

function formatDeadline(dateStr: string): { label: string; urgent: boolean } {
  try {
    const date = parseISO(dateStr);
    if (isPast(date)) return { label: "Closed", urgent: false };
    const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff <= 7) return { label: `${diff}d left`, urgent: true };
    return { label: date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), urgent: false };
  } catch {
    return { label: dateStr, urgent: false };
  }
}

export default function OpportunityCard({ opportunity, showBookmarkButton, isBookmarked, onBookmark }: Props) {
  const cat = CATEGORY_MAP[opportunity.category];
  const deadline = formatDeadline(opportunity.deadline);

  let postedLabel = "";
  try {
    postedLabel = formatDistanceToNow(parseISO(opportunity.postedAt), { addSuffix: true });
  } catch {
    postedLabel = opportunity.postedAt;
  }

  return (
    <article className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link href={`/opportunities/${opportunity.id}`}>
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--text)",
                lineHeight: 1.35,
                marginBottom: "0.25rem",
                transition: "color 0.1s ease",
              }}
              className="truncate-2"
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "underline")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.textDecoration = "none")}
            >
              {opportunity.title}
            </h3>
          </Link>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 600 }}>
            {opportunity.organisation}
          </p>
        </div>

        {/* Bookmark button */}
        {showBookmarkButton && (
          <button
            onClick={() => onBookmark?.(opportunity.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "1.1rem",
              color: isBookmarked ? "var(--accent)" : "var(--text-muted)",
              flexShrink: 0,
              padding: "0.1rem",
              transition: "color 0.15s ease",
            }}
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark opportunity"}
            title={isBookmarked ? "Remove bookmark" : "Save for later"}
          >
            {isBookmarked ? "★" : "☆"}
          </button>
        )}
      </div>

      {/* Subtitle */}
      <p
        style={{ fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: 1.5 }}
        className="truncate-2"
      >
        {opportunity.subtitle}
      </p>

      {/* Eligibility */}
      {opportunity.eligibility && (
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <strong style={{ color: "var(--text-secondary)" }}>Eligible: </strong>
          {opportunity.eligibility.length > 90
            ? opportunity.eligibility.slice(0, 90) + "…"
            : opportunity.eligibility}
        </p>
      )}

      {/* Tags */}
      {opportunity.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {opportunity.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag" style={{ fontSize: "0.68rem" }}>
              {tag}
            </span>
          ))}
          {opportunity.tags.length > 4 && (
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
              +{opportunity.tags.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "auto",
          paddingTop: "0.5rem",
          borderTop: "1px solid var(--border)",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {/* Category tag */}
          <span className="tag tag-accent" style={{ fontSize: "0.65rem" }}>
            {cat?.icon} {cat?.name}
          </span>

          {/* Trending badge */}
          {opportunity.isTrending && (
            <span className="tag" style={{ fontSize: "0.65rem", borderColor: "#d97706", color: "#d97706", backgroundColor: "transparent" }}>
              ↑ Trending
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {/* Deadline */}
          <span
            style={{
              fontSize: "0.72rem",
              color: deadline.urgent ? "var(--danger)" : "var(--text-muted)",
              fontWeight: deadline.urgent ? 700 : 400,
            }}
          >
            ⏰ {deadline.label}
          </span>

          {/* Apply */}
          <Link
            href={`/opportunities/${opportunity.id}`}
            className="btn btn-primary"
            style={{ fontSize: "0.72rem", padding: "0.3rem 0.625rem" }}
          >
            View →
          </Link>
        </div>
      </div>

      {/* Posted time */}
      <p style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>Posted {postedLabel}</p>
    </article>
  );
}
