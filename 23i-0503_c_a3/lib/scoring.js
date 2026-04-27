export function calculateScore(budget) {
  if (budget > 20000000) return "High";
  if (budget >= 10000000) return "Medium";
  return "Low";
}

export function getScoreBadgeColor(score) {
  switch (score) {
    case "High":
      return "bg-red-500/20 text-red-400 border border-red-500/30";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case "Low":
      return "bg-green-500/20 text-green-400 border border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}

export function getStatusBadgeColor(status) {
  switch (status) {
    case "New":
      return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
    case "Contacted":
      return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
    case "In Progress":
      return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
    case "Closed":
      return "bg-green-500/20 text-green-400 border border-green-500/30";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
}