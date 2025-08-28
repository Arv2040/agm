
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-6">🚀 Welcome to Vehicle Dashboard</h1>
      <Link
        href="/dealer"
        className="px-6 py-3 bg-indigo-600 rounded-lg text-white text-lg hover:bg-indigo-500 transition"
      >
        Go to Dealer Dashboard
      </Link>
    </div>
  );
}
