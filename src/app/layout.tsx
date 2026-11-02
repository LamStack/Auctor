import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-poppins" });

export const metadata: Metadata = {
  title: "AUCTOR — Bahrain's First Gamified Assessments Platform",
  description:
    "AUCTOR helps Bahrain tech companies hire based on real ability, not just CVs, through gamified job-simulation assessments.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Script
          src="http://localhost:3000/experience.js"
          data-key="wk_oqKA5N4gLlm1csGlE9Cqf4pn"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
