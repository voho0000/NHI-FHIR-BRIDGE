import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NHI-FHIR-Bridge",
  description: "健保存摺 → FHIR R4 bridge with SMART on FHIR support",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-blue-900 text-white px-6 py-3 shadow">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-lg font-bold tracking-wide">NHI-FHIR-Bridge</h1>
            <span className="text-sm text-blue-200">健保存摺 → FHIR R4</span>
          </div>
        </header>
        <main className="max-w-5xl mx-auto py-8 px-4">{children}</main>
      </body>
    </html>
  );
}
