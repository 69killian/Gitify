// lib/db.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getStreakLeaderboard(limit: number = 10) {
  return prisma.$queryRaw`
    SELECT 
      u.id,
      u.username,
      u.avatar_url,
      s.current_streak,
      s.longest_streak,
      RANK() OVER (ORDER BY s.current_streak DESC) as rank
    FROM "User" u
    JOIN "Streak" s ON u.id = s.user_id
    WHERE s.is_active = true
    ORDER BY s.current_streak DESC
    LIMIT ${limit}
  `
}

export default prisma