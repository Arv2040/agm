"use client"
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts";
import Link from "next/link";

const allTimeData = [
  { day: "Mon", vehicles: 50 },
  { day: "Tue", vehicles: 75 },
  { day: "Wed", vehicles: 60 },
  { day: "Thu", vehicles: 90 },
  { day: "Fri", vehicles: 100 },
  { day: "Sat", vehicles: 80 },
  { day: "Sun", vehicles: 95 },
];

const activeData = [
  { type: "Excavator", count: 12 },
  { type: "Loader", count: 8 },
  { type: "Bulldozer", count: 15 },
  { type: "Dump Truck", count: 10 },
];

export default function DealerDashboard() {
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
          All-Time
        </button>
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-2 rounded-lg ${tab === "active" ? "bg-yellow-500" : "bg-gray-700 hover:bg-gray-600"} transition`}
        >
          Active Vehicles
        </button>
      </div>

      {/* Content */}
      {tab === "alltime" ? (
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Vehicles per Day</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={allTimeData}>
                <CartesianGrid stroke="#555" />
                <XAxis dataKey="day" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8 }} />
                <Line type="monotone" dataKey="vehicles" stroke="#4f46e5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 shadow rounded-lg p-4 flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Total Vehicles</h2>
            <p className="text-4xl font-bold text-indigo-400 mt-4">540</p>
          </div>
        </main>
      ) : (
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Active Vehicles by Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={activeData}>
                <CartesianGrid stroke="#555" />
                <XAxis dataKey="type" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8 }} />
                <Bar dataKey="count" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 shadow rounded-lg p-4 flex flex-col justify-center items-center">
            <h2 className="text-xl font-semibold mb-2 text-gray-200">Total Active Vehicles</h2>
            <p className="text-4xl font-bold text-yellow-400 mt-4">45</p>
          </div>
        </main>
      )}

      <div className="mt-6">
        <Link href="/" className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
          ← Back
        </Link>
      </div>
    </div>
  );
}
