import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

/**
 * Endpoint GET pour récupérer l'historique des statistiques d'un utilisateur
 * 
 * Nécessite une authentification
 */
export async function GET(req: NextRequest) {
  try {
    console.log("Récupération de l'historique des statistiques...");

    // Vérifier l'authentification de l'utilisateur
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("Utilisateur non authentifié");
      return NextResponse.json(
        { error: "Vous devez être connecté pour accéder à ces statistiques" },
        { status: 401 }
      );
    }

    const userId = session.user.id as string;
    console.log(`Récupération de l'historique pour l'utilisateur: ${userId}`);

    // Récupérer les streaks de l'utilisateur
    const streaks = await prisma.streak.findMany({
      where: { user_id: userId },
      orderBy: { start_date: "desc" },
    });

    // Récupérer les contributions de l'utilisateur
    const contributions = await prisma.contribution.findMany({
      where: { user_id: userId },
      orderBy: { date: "desc" },
      take: 100, // Limiter à 100 pour des raisons de performance
    });

    // Récupérer les badges débloqués par l'utilisateur
    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: userId },
      include: {
        badge: {
          select: {
            name: true,
            icon: true,
            description: true,
          },
        },
      },
      orderBy: { unlocked_at: "desc" },
    });

    // Récupérer les défis de l'utilisateur
    const userChallenges = await prisma.userChallenge.findMany({
      where: { user_id: userId },
      include: {
        challenge: {
          select: {
            name: true,
            description: true,
            difficulty: true,
          },
        },
      },
      orderBy: { start_date: "desc" },
    });

    // Formater les données de streak pour l'historique
    const streakHistory = streaks.map(streak => ({
      id: streak.id,
      startDate: streak.start_date,
      endDate: streak.end_date,
      duration: streak.current_streak,
      isActive: streak.is_active,
    }));

    // Calculer les statistiques par mois
    const contributionsByMonth: Record<string, number> = {};
    
    contributions.forEach(contribution => {
      const month = contribution.date.toISOString().substring(0, 7); // format YYYY-MM
      contributionsByMonth[month] = (contributionsByMonth[month] || 0) + 1;
    });

    // Convertir en format de tableau pour faciliter l'utilisation côté client
    const monthlyStats = Object.entries(contributionsByMonth).map(([month, count]) => ({
      month,
      count,
    })).sort((a, b) => a.month.localeCompare(b.month));

    // Compiler les différentes statistiques
    const stats = {
      streakHistory,
      badgeHistory: userBadges.map(ub => ({
        id: ub.id,
        badge: ub.badge,
        unlockedAt: ub.unlocked_at,
      })),
      challengeHistory: userChallenges.map(uc => ({
        id: uc.id,
        challenge: uc.challenge,
        startDate: uc.start_date,
        endDate: uc.end_date,
        progress: uc.progress,
        status: uc.status,
      })),
      monthlyStats,
      summary: {
        totalBadges: userBadges.length,
        totalContributions: contributions.length,
        activeChallenges: userChallenges.filter(uc => uc.status === "in_progress").length,
        completedChallenges: userChallenges.filter(uc => uc.status === "completed").length,
        currentStreak: streaks.find(s => s.is_active)?.current_streak || 0,
        longestStreak: Math.max(...streaks.map(s => s.longest_streak), 0),
      }
    };

    console.log("Historique des statistiques récupéré avec succès");
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique des statistiques:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération de l'historique des statistiques" },
      { status: 500 }
    );
  }
} 