// ── Core Domain Types ─────────────────────────────────────────────────────────

export type CategorySlug =
  | "physics"
  | "chemistry"
  | "biology"
  | "economics"
  | "engineering"
  | "sde"
  | "finance"
  | "research"
  | "government"
  | "data-science"
  | "mba";

export interface Category {
  id: CategorySlug;
  slug: CategorySlug;
  name: string;
  icon: string; // emoji icon
  description: string;
  count?: number;
}

export interface Opportunity {
  id: string;
  title: string; // stored as-is; displayed in FULL CAPS via CSS/JS
  organisation: string;
  subtitle: string;
  description: string; // rich text HTML string
  eligibility: string;
  deadline: string; // ISO date string e.g. "2025-12-31"
  applyLink: string;
  category: CategorySlug;
  tags: string[];
  postedAt: string; // ISO date string
  updatedAt: string; // ISO date string
  isTrending: boolean;
  views: number;
}

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

export interface Bookmark {
  id: string; // composite: `${userId}_${opportunityId}`
  userId: string;
  opportunityId: string;
  savedAt: string; // ISO date string
}

export interface AdminRecord {
  email: string;
  addedAt: string; // ISO date string
}

// ── Form Types ────────────────────────────────────────────────────────────────

export type OpportunityFormData = Omit<
  Opportunity,
  "id" | "postedAt" | "updatedAt" | "views"
>;

// ── Filter & Search Types ─────────────────────────────────────────────────────

export type DeadlineFilter = "all" | "week" | "month" | "three-months";
export type SortOrder = "newest" | "deadline" | "trending";

export interface SearchFilters {
  query: string;
  category: CategorySlug | "all";
  tags: string[];
  deadline: DeadlineFilter;
  sort: SortOrder;
}

// ── AI Types ──────────────────────────────────────────────────────────────────

export interface AISuggestion {
  tags: string[];
  category: CategorySlug;
  score: number;
}

export interface SearchResult {
  opportunity: Opportunity;
  score: number;
}
