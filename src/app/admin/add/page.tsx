"use client";

import OpportunityForm from "@/components/admin/OpportunityForm";
import { addOpportunity } from "@/lib/firestore";
import type { OpportunityFormData } from "@/types";
import Footer from "@/components/layout/Footer";

export default function AddOpportunityPage() {
  const handleSubmit = async (data: OpportunityFormData) => {
    await addOpportunity(data);
  };

  return (
    <main>
      <div className="container-main" style={{ paddingTop: "2rem", paddingBottom: "3rem", maxWidth: "760px" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>Add New Opportunity</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Fill in the details below. Use the <strong>✦ AI Suggest</strong> button to auto-detect category and tags.
          </p>
        </div>
        <div style={{ border: "1px solid var(--border)", padding: "2rem", backgroundColor: "var(--bg)" }}>
          <OpportunityForm onSubmit={handleSubmit} submitLabel="Publish Opportunity" />
        </div>
      </div>
      <Footer />
    </main>
  );
}
