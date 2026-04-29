const rateLimitMap = new Map();

export function rateLimit(identifier, role) {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  // Admins have no limit
  if (role === "admin") return { allowed: true };

  // Agents: 50 requests per minute
  const limit = 50;

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, { count: 1, startTime: now });
    return { allowed: true };
  }

  const userLimit = rateLimitMap.get(identifier);

  // Reset window if expired
  if (now - userLimit.startTime > windowMs) {
    rateLimitMap.set(identifier, { count: 1, startTime: now });
    return { allowed: true };
  }

  // Check limit
  if (userLimit.count >= limit) {
    return {
      allowed: false,
      message: "Rate limit exceeded. Maximum 50 requests per minute for agents.",
      retryAfter: Math.ceil((windowMs - (now - userLimit.startTime)) / 1000),
    };
  }

  userLimit.count++;
  return { allowed: true };
}