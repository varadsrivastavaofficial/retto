import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 160px)",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <p style={{ fontSize: "4rem", fontWeight: 700, color: "var(--border)", marginBottom: "1rem" }}>404</p>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Page Not Found</h1>
          <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Link href="/" className="btn btn-primary">← Back to Home</Link>
            <Link href="/search" className="btn btn-outline">Browse Opportunities</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
