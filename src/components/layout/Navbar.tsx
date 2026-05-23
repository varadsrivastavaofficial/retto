"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { CATEGORIES } from "@/lib/categories";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="container-main" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: "'Times New Roman', Times, Georgia, serif",
            fontWeight: 700,
            fontSize: "1.35rem",
            letterSpacing: "0.02em",
            color: "var(--text)",
            flexShrink: 0,
          }}
          aria-label="Retto home"
        >
          Retto
        </Link>

        {/* Desktop nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }} className="desktop-nav">
          <Link
            href="/"
            style={{
              fontSize: "0.85rem",
              fontWeight: pathname === "/" ? 700 : 400,
              color: pathname === "/" ? "var(--text)" : "var(--text-secondary)",
              borderBottom: pathname === "/" ? "2px solid var(--accent)" : "2px solid transparent",
              paddingBottom: "2px",
              transition: "color 0.15s ease",
            }}
          >
            Home
          </Link>

          {/* Categories dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              style={{
                fontSize: "0.85rem",
                fontWeight: 400,
                color: "var(--text-secondary)",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
              aria-expanded={catOpen}
              aria-haspopup="true"
              id="categories-menu-button"
            >
              Categories
              <span style={{ fontSize: "0.65rem" }}>{catOpen ? "▲" : "▼"}</span>
            </button>

            {catOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--border)",
                  padding: "0.5rem 0",
                  width: "180px",
                  zIndex: 200,
                }}
                role="menu"
                aria-labelledby="categories-menu-button"
              >
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/categories/${cat.slug}`}
                    onClick={() => setCatOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.4rem 0.875rem",
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      transition: "background-color 0.1s ease, color 0.1s ease",
                    }}
                    role="menuitem"
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)";
                      (e.currentTarget as HTMLElement).style.color = "var(--text)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }}
                  >
                    <span>{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/search"
            style={{
              fontSize: "0.85rem",
              color: pathname === "/search" ? "var(--text)" : "var(--text-secondary)",
              fontWeight: pathname === "/search" ? 700 : 400,
              transition: "color 0.15s ease",
            }}
          >
            Search
          </Link>

          {user && (
            <Link
              href="/bookmarks"
              style={{
                fontSize: "0.85rem",
                color: pathname === "/bookmarks" ? "var(--text)" : "var(--text-secondary)",
                fontWeight: pathname === "/bookmarks" ? 700 : 400,
                transition: "color 0.15s ease",
              }}
            >
              Bookmarks
            </Link>
          )}

          {user?.isAdmin && (
            <Link
              href="/admin"
              style={{
                fontSize: "0.85rem",
                color: pathname.startsWith("/admin") ? "var(--text)" : "var(--text-secondary)",
                fontWeight: pathname.startsWith("/admin") ? 700 : 400,
                transition: "color 0.15s ease",
              }}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost"
            style={{ padding: "0.3rem 0.5rem", fontSize: "1rem" }}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? "☽" : "☀"}
          </button>

          {/* Auth button */}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontSize: "0.78rem",
                  color: "var(--text-muted)",
                  maxWidth: "120px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={user.email}
              >
                {user.displayName?.split(" ")[0] ?? user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="btn btn-outline"
                style={{ fontSize: "0.78rem", padding: "0.35rem 0.75rem" }}
                id="signout-button"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary" style={{ fontSize: "0.82rem" }} id="login-button">
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              fontSize: "1.25rem",
            }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            backgroundColor: "var(--bg)",
            padding: "1rem",
          }}
          className="mobile-menu"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link href="/" onClick={() => setMenuOpen(false)} style={{ fontSize: "0.9rem", color: "var(--text)" }}>Home</Link>
            <Link href="/search" onClick={() => setMenuOpen(false)} style={{ fontSize: "0.9rem", color: "var(--text)" }}>Search</Link>
            {user && <Link href="/bookmarks" onClick={() => setMenuOpen(false)} style={{ fontSize: "0.9rem", color: "var(--text)" }}>Bookmarks</Link>}
            {user?.isAdmin && <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ fontSize: "0.9rem", color: "var(--text)" }}>Admin</Link>}
            <hr style={{ borderColor: "var(--border)" }} />
            <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)" }}>Categories</p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categories/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                style={{ fontSize: "0.85rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
