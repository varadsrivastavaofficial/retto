/**
 * Retto Lightweight AI System
 * Zero external API calls. Fully synchronous. Keyword-based scoring.
 * Can be replaced with an LLM API by swapping these functions.
 */

import type { AISuggestion, CategorySlug, Opportunity, SearchResult } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Keyword → Category mapping
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_KEYWORDS: Record<CategorySlug, string[]> = {
  physics: ["physics", "quantum", "optics", "photon", "mechanics", "thermodynamics", "astrophysics", "cosmology", "nuclear", "condensed matter", "spectroscopy", "particle", "relativity"],
  chemistry: ["chemistry", "organic", "inorganic", "synthesis", "reaction", "compound", "molecule", "catalyst", "polymer", "spectroscopy", "titration", "reagent", "biochem"],
  biology: ["biology", "genetics", "cell", "microbiology", "ecology", "evolution", "botany", "zoology", "genomics", "proteomics", "neuroscience", "immunology", "biomedical", "dna", "rna", "crispr"],
  economics: ["economics", "econometrics", "macroeconomics", "microeconomics", "gdp", "inflation", "policy", "market", "trade", "fiscal", "monetary", "development economics", "rbi", "finance ministry"],
  engineering: ["engineering", "mechanical", "civil", "electrical", "aerospace", "automobile", "structural", "materials", "manufacturing", "robotics", "cad", "control systems"],
  sde: ["software", "coding", "programming", "developer", "web", "mobile", "app", "backend", "frontend", "fullstack", "api", "open source", "github", "javascript", "python", "java", "hackathon", "sde", "devops", "cloud"],
  finance: ["finance", "investment", "banking", "equity", "markets", "hedge fund", "fintech", "valuation", "ipo", "portfolio", "trading", "risk", "credit", "derivatives", "cfa"],
  research: ["research", "fellowship", "academic", "publication", "thesis", "phd", "interdisciplinary", "grant", "scientist", "lab", "professor", "postdoc", "seminar"],
  government: ["government", "ias", "upsc", "ministry", "policy", "public sector", "civil service", "ngo", "governance", "regulation", "scheme", "public administration"],
  "data-science": ["data science", "machine learning", "deep learning", "neural network", "ai", "artificial intelligence", "nlp", "computer vision", "statistics", "analytics", "kaggle", "pandas", "python", "big data", "sql"],
  mba: ["mba", "management", "business", "mba program", "b-school", "strategy", "consulting", "operations", "marketing", "hr", "iim", "insead", "leadership", "case study"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Tag dictionary
// ─────────────────────────────────────────────────────────────────────────────

const TAG_KEYWORDS: Record<string, string[]> = {
  internship: ["internship", "intern", "work experience", "training"],
  fellowship: ["fellowship", "fellow"],
  scholarship: ["scholarship", "award", "grant", "funded", "fund"],
  research: ["research", "lab", "laboratory", "experiment", "study"],
  remote: ["remote", "online", "virtual", "work from home"],
  stipend: ["stipend", "paid", "remuneration", "compensation"],
  international: ["international", "global", "abroad", "overseas", "foreign"],
  competition: ["competition", "contest", "challenge", "olympiad"],
  hackathon: ["hackathon", "hack", "sprint"],
  "summer-program": ["summer", "may", "june", "july", "august"],
  undergraduate: ["undergraduate", "ug", "b.tech", "b.e", "b.sc", "bachelor"],
  postgraduate: ["postgraduate", "pg", "m.tech", "m.sc", "master", "mba"],
  "open-source": ["open source", "github", "open-source", "oss"],
  government: ["government", "ministry", "public sector", "ias"],
};

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

function normalise(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function countOccurrences(text: string, terms: string[]): number {
  return terms.reduce((acc, term) => {
    const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    const matches = text.match(regex);
    return acc + (matches ? matches.length : 0);
  }, 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-suggest category from description
// ─────────────────────────────────────────────────────────────────────────────

export function inferCategory(text: string): CategorySlug {
  const norm = normalise(text);
  let bestCategory: CategorySlug = "research";
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const score = countOccurrences(norm, keywords);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = cat as CategorySlug;
    }
  }

  return bestCategory;
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-suggest tags from description
// ─────────────────────────────────────────────────────────────────────────────

export function inferTags(text: string): string[] {
  const norm = normalise(text);
  const tags: string[] = [];

  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (countOccurrences(norm, keywords) > 0) {
      tags.push(tag);
    }
  }

  return tags;
}

// ─────────────────────────────────────────────────────────────────────────────
// Full AI suggestion (category + tags)
// ─────────────────────────────────────────────────────────────────────────────

export function getAISuggestion(title: string, description: string): AISuggestion {
  const combined = `${title} ${description}`;
  const norm = normalise(combined);

  const category = inferCategory(combined);
  const tags = inferTags(combined);

  // Compute category confidence score (0–1)
  const catKeywords = CATEGORY_KEYWORDS[category];
  const score = Math.min(1, countOccurrences(norm, catKeywords) / 5);

  return { category, tags, score };
}

// ─────────────────────────────────────────────────────────────────────────────
// Search relevance scoring
// ─────────────────────────────────────────────────────────────────────────────

export function scoreOpportunity(opportunity: Opportunity, query: string): number {
  if (!query.trim()) return 1; // no query = equal weight

  const norm = normalise(query);
  const terms = norm.split(/\s+/).filter(Boolean);
  let score = 0;

  const titleNorm = normalise(opportunity.title);
  const orgNorm = normalise(opportunity.organisation);
  const subtitleNorm = normalise(opportunity.subtitle);
  const tagsNorm = normalise(opportunity.tags.join(" "));
  const descNorm = normalise(opportunity.description.replace(/<[^>]+>/g, " "));

  for (const term of terms) {
    if (titleNorm.includes(term)) score += 10;
    if (orgNorm.includes(term)) score += 6;
    if (subtitleNorm.includes(term)) score += 5;
    if (tagsNorm.includes(term)) score += 4;
    if (descNorm.includes(term)) score += 1;
  }

  // Boost trending
  if (opportunity.isTrending) score += 2;

  return score;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search & rank opportunities
// ─────────────────────────────────────────────────────────────────────────────

export function searchOpportunities(
  opportunities: Opportunity[],
  query: string,
  category?: CategorySlug | "all"
): SearchResult[] {
  let filtered = opportunities;

  if (category && category !== "all") {
    filtered = filtered.filter((o) => o.category === category);
  }

  const results: SearchResult[] = filtered.map((o) => ({
    opportunity: o,
    score: scoreOpportunity(o, query),
  }));

  if (query.trim()) {
    return results
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  return results.sort((a, b) => {
    if (b.opportunity.isTrending !== a.opportunity.isTrending) {
      return b.opportunity.isTrending ? 1 : -1;
    }
    return new Date(b.opportunity.postedAt).getTime() - new Date(a.opportunity.postedAt).getTime();
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Similar opportunity recommendations
// ─────────────────────────────────────────────────────────────────────────────

export function getSimilarOpportunities(
  target: Opportunity,
  all: Opportunity[],
  count = 3
): Opportunity[] {
  const others = all.filter((o) => o.id !== target.id);

  const scored = others.map((o) => {
    let score = 0;
    // Same category = strong signal
    if (o.category === target.category) score += 8;
    // Shared tags
    const shared = o.tags.filter((t) => target.tags.includes(t)).length;
    score += shared * 2;
    return { o, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.o);
}
