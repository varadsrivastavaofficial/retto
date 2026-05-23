/**
 * POST /api/cron/cleanup
 *
 * Deletes Firestore opportunities whose deadline was more than 30 days ago.
 * Also deletes any bookmarks referencing those opportunities.
 *
 * Protected by CRON_SECRET — Vercel Cron passes it as an Authorization header.
 * To call manually:  curl -X POST https://<your-domain>/api/cron/cleanup \
 *                         -H "Authorization: Bearer <CRON_SECRET>"
 */

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs"; // needs firebase-admin (not edge)
export const dynamic = "force-dynamic";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function POST(req: NextRequest) {
  // ── Auth guard ────────────────────────────────────────────────────────────
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Find expired opportunities ────────────────────────────────────────────
  const db = getAdminDb();
  const now = Date.now();
  const cutoff = new Date(now - THIRTY_DAYS_MS).toISOString().split("T")[0]; // "YYYY-MM-DD"

  // deadline is stored as "YYYY-MM-DD" — string comparison works correctly here
  const snapshot = await db
    .collection("opportunities")
    .where("deadline", "<", cutoff)
    .get();

  if (snapshot.empty) {
    return NextResponse.json({ deleted: 0, message: "Nothing to clean up." });
  }

  const expiredIds: string[] = snapshot.docs.map((d) => d.id);

  // ── Batch delete opportunities + their bookmarks ──────────────────────────
  // Firestore batch limit = 500 writes. Chunk if necessary.
  const BATCH_SIZE = 400; // leave headroom for bookmark deletes in the same batch

  let totalDeleted = 0;

  for (let i = 0; i < expiredIds.length; i += BATCH_SIZE) {
    const chunk = expiredIds.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    for (const id of chunk) {
      // Delete the opportunity
      batch.delete(db.collection("opportunities").doc(id));

      // Delete matching bookmarks (query first, then delete in same batch)
      const bookmarksSnap = await db
        .collection("bookmarks")
        .where("opportunityId", "==", id)
        .get();

      for (const bDoc of bookmarksSnap.docs) {
        batch.delete(bDoc.ref);
      }
    }

    await batch.commit();
    totalDeleted += chunk.length;
  }

  console.log(
    `[cron/cleanup] Deleted ${totalDeleted} expired opportunities (deadline < ${cutoff})`
  );

  return NextResponse.json({
    deleted: totalDeleted,
    cutoff,
    ids: expiredIds,
  });
}

// Allow GET for easy manual testing in the browser (still requires the secret)
export async function GET(req: NextRequest) {
  return POST(req);
}
