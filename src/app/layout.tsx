import type { Metadata } from "next";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Retto — Opportunities for College Students",
    template: "%s | Retto",
  },
  description:
    "Discover internships, jobs, research programs, fellowships, summer schools, hackathons, and competitions tailored for college students.",
  keywords: [
    "internships for students",
    "research fellowships India",
    "college opportunities",
    "hackathons 2025",
    "summer programs",
    "scholarships India",
    "Retto",
  ],
  authors: [{ name: "Retto" }],
  creator: "Retto",
  openGraph: {
    title: "Retto — Opportunities for College Students",
    description: "The fastest way to find internships, research, and fellowships.",
    type: "website",
    locale: "en_IN",
    siteName: "Retto",
  },
  twitter: {
    card: "summary",
    title: "Retto",
    description: "Discover opportunities for college students.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
