import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

/**
 * Endpoint GET pour récupérer les statistiques d'un utilisateur spécifique
 * 
 * Paramètres d'URL:
 * - userId: ID de l'utilisateur (optionnel, utilise l'utilisateur connecté par défaut)
 * 
 * Nécessite une authentification
 */
export async function GET(req: NextRequest) {
  try {
    console.log("Récupération des statistiques utilisateur...");

    // Vérifier l'authentification de l'utilisateur
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.log("Utilisateur non authentifié");
      return NextResponse.json(
        { error: "Vous devez être connecté pour accéder à ces statistiques" },
        { status: 401 }
      );
    }

    // Récupérer l'ID de l'utilisateur à partir des paramètres d'URL ou utiliser l'utilisateur connecté
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId") || session.user.id as string;

    console.log(`Récupération des statistiques pour l'utilisateur: ${userId}`);

    // Récupérer les informations de base de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatar_url: true,
      },
    });

    if (!user) {
      console.log("Utilisateur non trouvé");
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Récupérer les streaks de l'utilisateur
    const streaks = await prisma.streak.findMany({
      where: { user_id: userId },
      orderBy: { start_date: "desc" },
    });

    // Récupérer le nombre de badges de l'utilisateur
    const badgeCount = await prisma.userBadge.count({
      where: { user_id: userId },
    });

    // Récupérer le nombre de contributions de l'utilisateur
    const contributionCount = await prisma.contribution.count({
      where: { user_id: userId },
    });

    // Récupérer le nombre de défis de l'utilisateur
    const challengesCount = await prisma.userChallenge.count({
      where: { user_id: userId },
    });

    const completedChallengesCount = await prisma.userChallenge.count({
      where: {
        user_id: userId,
        status: "completed",
      },
    });

    // Calculer les statistiques
    const currentStreak = streaks.find(s => s.is_active)?.current_streak || 0;
    const longestStreak = Math.max(...streaks.map(s => s.longest_streak), 0);
    
    // Calcul d'un score fictif basé sur les différentes métriques
    const score = currentStreak * 10 + badgeCount * 50 + contributionCount + completedChallengesCount * 100;

    // Compiler les statistiques de l'utilisateur
    const userStats = {
      user: {
        id: user.id,
        username: user.username,
        avatar_url: user.avatar_url,
      },
      stats: {
        currentStreak,
        longestStreak,
        badgeCount,
        contributionCount,
        challengesCount,
        completedChallengesCount,
        score,
      },
    };

    console.log("Statistiques utilisateur récupérées avec succès");
    return NextResponse.json(userStats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques utilisateur:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des statistiques utilisateur" },
      { status: 500 }
    );
  }
} 