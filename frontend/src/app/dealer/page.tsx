import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">🚜 Dealer Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of all vehicles and performance metrics.</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Total Vehicles</h2>
          <p className="mt-2 text-3xl font-bold text-indigo-600">120</p>
        </div>

        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Operating Hours Today</h2>
          <p className="mt-2 text-3xl font-bold text-green-500">1,450</p>
        </div>

        
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Idle Hours Today</h2>
          <p className="mt-2 text-3xl font-bold text-red-500">230</p>
        </div>

       
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Active Vehicles</h2>
          <p className="mt-2 text-3xl font-bold text-yellow-500">95</p>
        </div>


        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Maintenance Due</h2>
          <p className="mt-2 text-3xl font-bold text-pink-500">12</p>
        </div>

       
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-700">Avg Engine Hours</h2>
          <p className="mt-2 text-3xl font-bold text-purple-600">14h</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
