"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { CATEGORIES } from "@/lib/categories";
import { getAISuggestion } from "@/lib/ai";
import type { OpportunityFormData, CategorySlug } from "@/types";

interface Props {
  initialData?: Partial<OpportunityFormData>;
  onSubmit: (data: OpportunityFormData) => Promise<void>;
  submitLabel?: string;
  isEdit?: boolean;
}

const EMPTY_FORM: OpportunityFormData = {
  title: "",
  organisation: "",
  subtitle: "",
  description: "",
  eligibility: "",
  deadline: "",
  applyLink: "",
  category: "research",
  tags: [],
  isTrending: false,
};

export default function OpportunityForm({ initialData, onSubmit, submitLabel = "Publish Opportunity", isEdit = false }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<OpportunityFormData>({ ...EMPTY_FORM, ...initialData });
  const [tagInput, setTagInput] = useState((initialData?.tags ?? []).join(", "));
  const [submitting, setSubmitting] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{ tags: string[]; category: CategorySlug } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: "Write a detailed description..." }),
    ],
    content: initialData?.description ?? "",
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, description: editor.getHTML() }));
    },
  });

  // Destroy editor on unmount
  useEffect(() => {
    return () => { editor?.destroy(); };
  }, [editor]);

  const handleAISuggest = () => {
    const suggestion = getAISuggestion(form.title, form.description);
    setAiSuggestion(suggestion);
    setForm((prev) => ({ ...prev, category: suggestion.category }));
    const merged = Array.from(new Set([...tagInput.split(",").map(t => t.trim()).filter(Boolean), ...suggestion.tags]));
    setTagInput(merged.join(", "));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.organisation || !form.deadline || !form.applyLink) {
      alert("Please fill in all required fields.");
      return;
    }
    setSubmitting(true);
    try {
      const tags = tagInput.split(",").map(t => t.trim()).filter(Boolean);
      await onSubmit({ ...form, tags });
      router.push("/admin");
    } catch (err) {
      console.error(err);
      alert("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const field = (key: keyof OpportunityFormData) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-group">
        {/* Title */}
        <div>
          <label className="label" htmlFor="form-title">Title *</label>
          <input
            id="form-title"
            type="text"
            className="input"
            value={form.title}
            {...field("title")}
            placeholder="e.g. Summer Research Internship in Quantum Physics"
            required
          />
          <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Will be displayed in FULL CAPITALS automatically.
          </p>
        </div>

        {/* Organisation */}
        <div>
          <label className="label" htmlFor="form-org">Organisation *</label>
          <input id="form-org" type="text" className="input" value={form.organisation} {...field("organisation")} placeholder="e.g. IISc, TIFR, Google" required />
        </div>

        {/* Subtitle */}
        <div>
          <label className="label" htmlFor="form-subtitle">Subtitle</label>
          <input id="form-subtitle" type="text" className="input" value={form.subtitle} {...field("subtitle")} placeholder="One-line summary" />
        </div>

        {/* Category + AI */}
        <div>
          <label className="label" htmlFor="form-category">Category *</label>
          <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap" }}>
            <select
              id="form-category"
              className="input select"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value as CategorySlug }))}
              style={{ flex: 1, minWidth: "160px" }}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAISuggest}
              className="btn btn-outline"
              style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}
              title="Auto-detect category and tags from title + description"
            >
              ✦ AI Suggest
            </button>
          </div>
          {aiSuggestion && (
            <p style={{ fontSize: "0.72rem", color: "var(--success)", marginTop: "0.375rem" }}>
              AI suggested: {aiSuggestion.category} · Tags: {aiSuggestion.tags.join(", ")}
            </p>
          )}
        </div>

        {/* Description (rich text) */}
        <div>
          <label className="label">Description *</label>
          {/* Toolbar */}
          <div style={{ display: "flex", gap: "0.25rem", padding: "0.375rem 0.5rem", border: "1px solid var(--border)", borderBottom: "none", flexWrap: "wrap" }}>
            {[
              { label: "B", action: () => editor?.chain().focus().toggleBold().run(), title: "Bold" },
              { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), title: "Italic" },
              { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), title: "Heading 2" },
              { label: "H3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), title: "Heading 3" },
              { label: "• List", action: () => editor?.chain().focus().toggleBulletList().run(), title: "Bullet list" },
              { label: "1. List", action: () => editor?.chain().focus().toggleOrderedList().run(), title: "Ordered list" },
            ].map(({ label, action, title }) => (
              <button key={label} type="button" onClick={action} className="btn btn-ghost" style={{ fontSize: "0.75rem", padding: "0.15rem 0.5rem" }} title={title}>
                {label}
              </button>
            ))}
          </div>
          <EditorContent editor={editor} className="tiptap-editor" />
        </div>

        {/* Eligibility */}
        <div>
          <label className="label" htmlFor="form-eligibility">Eligibility</label>
          <textarea
            id="form-eligibility"
            className="input"
            value={form.eligibility}
            {...field("eligibility")}
            rows={3}
            placeholder="Who can apply? Include year, stream, GPA requirements..."
            style={{ resize: "vertical" }}
          />
        </div>

        {/* Deadline + Apply link */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
          <div>
            <label className="label" htmlFor="form-deadline">Deadline *</label>
            <input id="form-deadline" type="date" className="input" value={form.deadline} {...field("deadline")} required />
          </div>
          <div>
            <label className="label" htmlFor="form-applyLink">Application Link *</label>
            <input id="form-applyLink" type="url" className="input" value={form.applyLink} {...field("applyLink")} placeholder="https://..." required />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="label" htmlFor="form-tags">Tags</label>
          <input
            id="form-tags"
            type="text"
            className="input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="internship, stipend, research, remote (comma-separated)"
          />
        </div>

        {/* Trending toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <input
            id="form-trending"
            type="checkbox"
            checked={form.isTrending}
            onChange={(e) => setForm((prev) => ({ ...prev, isTrending: e.target.checked }))}
            style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--accent)" }}
          />
          <label htmlFor="form-trending" style={{ fontSize: "0.875rem", cursor: "pointer" }}>
            Mark as Trending
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", paddingTop: "0.5rem" }}>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ fontSize: "0.875rem", padding: "0.625rem 1.5rem" }}
            id="submit-opportunity-button"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="btn btn-outline"
            style={{ fontSize: "0.875rem" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
