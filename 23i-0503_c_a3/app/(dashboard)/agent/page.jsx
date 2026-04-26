import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AgentDashboard() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "agent") redirect("/admin");

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">Agent Dashboard</h2>
      <p className="text-gray-400">Your assigned leads will appear here.</p>
    </div>
  );
}