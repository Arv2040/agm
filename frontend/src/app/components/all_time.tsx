// components/AllTimeStats.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

export default function AllTimeStats() {
  const allTimeData = [
    { day: "Mon", vehicles: 120, idle: 30, operating: 90 },
    { day: "Tue", vehicles: 140, idle: 40, operating: 100 },
    { day: "Wed", vehicles: 130, idle: 25, operating: 105 },
    { day: "Thu", vehicles: 150, idle: 35, operating: 115 },
    { day: "Fri", vehicles: 160, idle: 20, operating: 140 },
    { day: "Sat", vehicles: 145, idle: 30, operating: 115 },
    { day: "Sun", vehicles: 155, idle: 25, operating: 130 },
  ];

  const totalVehicles = allTimeData.reduce((sum, d) => sum + d.vehicles, 0);
  const totalIdle = allTimeData.reduce((sum, d) => sum + d.idle, 0);
  const totalOperating = allTimeData.reduce((sum, d) => sum + d.operating, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-800 shadow rounded-lg p-4">
        <h2 className="text-xl font-semibold text-gray-200 mb-2">Vehicles per Day</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={allTimeData}>
            <CartesianGrid stroke="#555" />
            <XAxis dataKey="day" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: "#1f2937", borderRadius: 8 }} />
            <Line type="monotone" dataKey="vehicles" stroke="#4f46e5" strokeWidth={3} />
            <Line type="monotone" dataKey="operating" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="idle" stroke="#f87171" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gray-800 shadow rounded-lg p-4 flex flex-col justify-center items-center space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-200">Total Vehicles</h2>
          <p className="text-4xl font-bold text-indigo-400 mt-2">{totalVehicles}</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-200">Total Operating Hours</h2>
          <p className="text-4xl font-bold text-green-400 mt-2">{totalOperating}</p>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-200">Total Idle Hours</h2>
          <p className="text-4xl font-bold text-red-400 mt-2">{totalIdle}</p>
        </div>
      </div>
    </div>
  );
}
