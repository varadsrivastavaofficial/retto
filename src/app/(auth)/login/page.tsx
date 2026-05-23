"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signInWithGoogle } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.replace("/");
    } catch (err) {
      console.error("Sign-in error:", err);
      alert("Sign-in failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 56px)",
            padding: "2rem 1rem",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "380px",
              border: "1px solid var(--border)",
              padding: "2.5rem 2rem",
              backgroundColor: "var(--bg)",
            }}
          >
            {/* Logo */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <Link href="/" style={{ fontWeight: 700, fontSize: "1.5rem", color: "var(--text)" }}>
                Retto
              </Link>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.375rem" }}>
                Opportunities for serious students
              </p>
            </div>

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid var(--border)",
                marginBottom: "1.75rem",
                position: "relative",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: "-0.65rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "var(--bg)",
                  padding: "0 0.5rem",
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Sign In
              </span>
            </div>

            {/* Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              className="btn btn-outline"
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.9rem",
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                gap: "0.625rem",
              }}
              id="google-signin-button"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M17.64 9.2045c0-.638-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.908c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.4673-.8064 5.9564-2.1818l-2.908-2.2581c-.8064.54-1.8368.8591-3.0482.8591-2.3427 0-4.3282-1.5832-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71c-.18-.54-.2836-1.1182-.2836-1.71s.1036-1.17.2836-1.71V4.9582H.9574C.3473 6.1732 0 7.5477 0 9s.3473 2.8268.9574 4.0418L3.964 10.71z" fill="#FBBC05"/>
                <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5813C13.4636.8918 11.4264 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6573 3.5795 9 3.5795z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textAlign: "center",
                marginTop: "1.25rem",
                lineHeight: 1.6,
              }}
            >
              By signing in, you agree to our terms. We only use Google authentication — no passwords stored.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
