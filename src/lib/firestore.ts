import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  setDoc,
  serverTimestamp,
  Timestamp,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Opportunity, Bookmark, CategorySlug } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function timestampToISO(val: unknown): string {
  if (!val) return new Date().toISOString();
  if (val instanceof Timestamp) return val.toDate().toISOString();
  if (typeof val === "string") return val;
  return new Date().toISOString();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toOpportunity(id: string, data: Record<string, any>): Opportunity {
  return {
    id,
    title: data.title ?? "",
    organisation: data.organisation ?? "",
    subtitle: data.subtitle ?? "",
    description: data.description ?? "",
    eligibility: data.eligibility ?? "",
    deadline: data.deadline ?? "",
    applyLink: data.applyLink ?? "",
    category: data.category ?? "research",
    tags: data.tags ?? [],
    postedAt: timestampToISO(data.postedAt),
    updatedAt: timestampToISO(data.updatedAt),
    isTrending: data.isTrending ?? false,
    views: data.views ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Opportunities
// ─────────────────────────────────────────────────────────────────────────────

export async function getOpportunities(opts?: {
  category?: CategorySlug;
  limitCount?: number;
  onlyTrending?: boolean;
}): Promise<Opportunity[]> {
  const constraints: QueryConstraint[] = [];

  if (opts?.category) {
    constraints.push(where("category", "==", opts.category));
  }
  if (opts?.onlyTrending) {
    constraints.push(where("isTrending", "==", true));
  }
  constraints.push(orderBy("postedAt", "desc"));
  if (opts?.limitCount) {
    constraints.push(limit(opts.limitCount));
  }

  const q = query(collection(db, "opportunities"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => toOpportunity(d.id, d.data() as Record<string, unknown>));
}

export async function getOpportunityById(id: string): Promise<Opportunity | null> {
  const ref = doc(db, "opportunities", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toOpportunity(snap.id, snap.data() as Record<string, unknown>);
}

export async function addOpportunity(
  data: Omit<Opportunity, "id" | "postedAt" | "updatedAt" | "views">
): Promise<string> {
  const ref = await addDoc(collection(db, "opportunities"), {
    ...data,
    views: 0,
    postedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateOpportunity(
  id: string,
  data: Partial<Omit<Opportunity, "id" | "postedAt">>
): Promise<void> {
  const ref = doc(db, "opportunities", id);
  await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteOpportunity(id: string): Promise<void> {
  await deleteDoc(doc(db, "opportunities", id));
}

export async function incrementViews(id: string): Promise<void> {
  const ref = doc(db, "opportunities", id);
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const current = (snap.data().views as number) ?? 0;
    await updateDoc(ref, { views: current + 1 });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Bookmarks
// ─────────────────────────────────────────────────────────────────────────────

export async function getUserBookmarks(userId: string): Promise<Bookmark[]> {
  const q = query(
    collection(db, "bookmarks"),
    where("userId", "==", userId),
    orderBy("savedAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      userId: data.userId,
      opportunityId: data.opportunityId,
      savedAt: timestampToISO(data.savedAt),
    };
  });
}

export async function addBookmark(userId: string, opportunityId: string): Promise<void> {
  const id = `${userId}_${opportunityId}`;
  await setDoc(doc(db, "bookmarks", id), {
    userId,
    opportunityId,
    savedAt: serverTimestamp(),
  });
}

export async function removeBookmark(userId: string, opportunityId: string): Promise<void> {
  const id = `${userId}_${opportunityId}`;
  await deleteDoc(doc(db, "bookmarks", id));
}

export async function isBookmarked(userId: string, opportunityId: string): Promise<boolean> {
  const id = `${userId}_${opportunityId}`;
  const snap = await getDoc(doc(db, "bookmarks", id));
  return snap.exists();
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin check
// ─────────────────────────────────────────────────────────────────────────────

export async function checkIsAdmin(email: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "admins", email));
  return snap.exists();
}
