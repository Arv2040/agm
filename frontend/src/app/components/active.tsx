// components/ActiveAnalytics.tsx
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function ActiveAnalytics() {
  // Vehicle types as a readonly tuple
  const vehicleTypes = ["Excavator", "Loader", "Bulldozer", "Dump Truck"] as const;

  // VehicleType is now a union of string literals
  type VehicleType = typeof vehicleTypes[number];

  const activeData: Record<VehicleType, { day: string; count: number }[]> = {
    Excavator: [
      { day: "Mon", count: 5 }, { day: "Tue", count: 6 }, { day: "Wed", count: 4 },
      { day: "Thu", count: 7 }, { day: "Fri", count: 6 }, { day: "Sat", count: 5 }, { day: "Sun", count: 6 },
    ],
    Loader: [
      { day: "Mon", count: 3 }, { day: "Tue", count: 4 }, { day: "Wed", count: 5 },
      { day: "Thu", count: 4 }, { day: "Fri", count: 6 }, { day: "Sat", count: 4 }, { day: "Sun", count: 5 },
    ],
    Bulldozer: [
      { day: "Mon", count: 7 }, { day: "Tue", count: 6 }, { day: "Wed", count: 8 },
      { day: "Thu", count: 7 }, { day: "Fri", count: 7 }, { day: "Sat", count: 6 }, { day: "Sun", count: 7 },
    ],
    "Dump Truck": [
      { day: "Mon", count: 5 }, { day: "Tue", count: 4 }, { day: "Wed", count: 5 },
      { day: "Thu", count: 6 }, { day: "Fri", count: 5 }, { day: "Sat", count: 5 }, { day: "Sun", count: 5 },
    ],
  };

  // Correctly type the selected vehicle
  const [selected, setSelected] = useState<VehicleType>(vehicleTypes[0]);

  // totalCount is now safe
  const totalCount = activeData[selected].reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 shadow rounded-lg p-4">
        <div className="mb-4">
          <label className="text-gray-200 mr-2">Select Vehicle:</label>
          <select
            className="bg-gray-700 text-white rounded px-2 py-1"
            value={selected}
            onChange={(e) => setSelected(e.target.value as VehicleType)}
          >
            {vehicleTypes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-xl font-semibold text-gray-200 mb-2">Active Vehicles Over Week</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activeData[selected]}>
            <CartesianGrid stroke="#555" />
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8 }} />
            <Bar dataKey="count" fill="#facc15" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 shadow rounded-lg p-4 flex flex-col justify-center items-center">
        <h2 className="text-xl font-semibold text-gray-200">Total Active Vehicles</h2>
        <p className="text-4xl font-bold text-yellow-400 mt-4">{totalCount}</p>
      </div>
    </div>
  );
}
