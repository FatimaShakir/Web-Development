import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") redirect("/agent");

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h2>
      <p className="text-gray-400">Analytics and overview will appear here.</p>
    </div>
  );
}