"use client"
import { useState } from "react";
import AllTimeStats from "../components/active";
import ActiveAnalytics from "../components/all_time";
import Link from "next/link";

export default function DealerPage() {
  const [tab, setTab] = useState<"alltime" | "active">("alltime");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">🚜 Dealer Dashboard</h1>
        <p className="text-gray-400 mt-2">View metrics by tab.</p>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setTab("alltime")}
          className={`px-4 py-2 rounded-lg ${tab === "alltime" ? "bg-indigo-600" : "bg-gray-700 hover:bg-gray-600"} transition`}
        >
          All-Time Stats
        </button>
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-2 rounded-lg ${tab === "active" ? "bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"} transition`}
        >
          Active Analytics
        </button>
      </div>

     
      {tab === "alltime" ? <AllTimeStats /> : <ActiveAnalytics />}

      <div className="mt-6">
        <Link href="/" className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
          ← Back
        </Link>
      </div>
    </div>
  );
}
