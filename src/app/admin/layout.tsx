"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else if (!user.isAdmin) {
        router.replace("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "4rem 2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Checking permissions...
        </div>
      </>
    );
  }

  if (!user || !user.isAdmin) return null;

  return (
    <>
      <Navbar />
      {/* Admin top bar */}
      <div
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          padding: "0.5rem 0",
        }}
      >
        <div className="container-main" style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            Admin Panel
          </span>
          {[
            { label: "Dashboard", href: "/admin" },
            { label: "Add Opportunity", href: "/admin/add" },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              style={{ fontSize: "0.8rem", color: "var(--text-secondary)", transition: "color 0.1s ease" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-secondary)")}
            >
              {label}
            </a>
          ))}
          <span style={{ marginLeft: "auto", fontSize: "0.72rem", color: "var(--text-muted)" }}>
            Signed in as {user.email}
          </span>
        </div>
      </div>
      {children}
    </>
  );
}
