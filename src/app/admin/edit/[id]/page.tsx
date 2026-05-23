"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OpportunityForm from "@/components/admin/OpportunityForm";
import { getOpportunityById, updateOpportunity } from "@/lib/firestore";
import { DUMMY_OPPORTUNITIES } from "@/lib/dummy-data";
import type { Opportunity, OpportunityFormData } from "@/types";
import Footer from "@/components/layout/Footer";

export default function EditOpportunityPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const opp = await getOpportunityById(id);
        // Fallback to dummy data in dev
        setOpportunity(opp ?? DUMMY_OPPORTUNITIES.find((o) => o.id === id) ?? null);
      } catch {
        setOpportunity(DUMMY_OPPORTUNITIES.find((o) => o.id === id) ?? null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (data: OpportunityFormData) => {
    await updateOpportunity(id, data);
  };

  if (loading) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
        Loading...
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <p style={{ fontWeight: 700 }}>Opportunity not found.</p>
        <button onClick={() => router.push("/admin")} className="btn btn-outline" style={{ marginTop: "1rem" }}>
          Back to Admin
        </button>
      </div>
    );
  }

  return (
    <main>
      <div className="container-main" style={{ paddingTop: "2rem", paddingBottom: "3rem", maxWidth: "760px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Edit Opportunity</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
            {opportunity.title}
          </p>
        </div>
        <div style={{ border: "1px solid var(--border)", padding: "2rem", backgroundColor: "var(--bg)" }}>
          <OpportunityForm
            initialData={opportunity}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            isEdit
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
