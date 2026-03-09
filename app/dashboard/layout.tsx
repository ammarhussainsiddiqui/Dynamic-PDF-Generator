"use client";

import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-6xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8 flex-grow">
        {children}
      </main>
      <footer className="py-6 text-center text-sm text-gray-500 bg-white border-t border-gray-200 mt-auto flex-shrink-0">
        <p>Built by <span className="font-bold text-gray-800">Ammar Hussain Siddiqui</span></p>
      </footer>
    </div>
  );
}
