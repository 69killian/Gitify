import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

/**
 * GET /api/challenges
 * Récupère les challenges disponibles, en cours et complétés pour l'utilisateur
 */
export async function GET() {
  try {
    // Vérifier l'authentification de l'utilisateur
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour voir vos challenges." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Récupérer tous les challenges disponibles
    const allChallenges = await prisma.challenge.findMany({
      include: {
        rewardBadge: true
      }
    });

    // Récupérer les challenges de l'utilisateur
    const userChallenges = await prisma.userChallenge.findMany({
      where: {
        user_id: userId
      },
      include: {
        challenge: {
          include: {
            rewardBadge: true
          }
        }
      }
    });

    // Séparer les challenges en cours et complétés
    const inProgressChallenges = userChallenges.filter(uc => uc.status === "in_progress").map(uc => ({
      id: uc.id,
      challengeId: uc.challenge_id,
      title: uc.challenge.name,
      description: uc.challenge.description || "",
      progress: uc.progress,
      startDate: uc.start_date.toISOString(),
      timeLeft: uc.challenge.duration ? `${uc.challenge.duration} jours` : "Non défini",
      badge: uc.challenge.rewardBadge?.icon || "🏆",
      reward: uc.challenge.rewardBadge?.name || "Badge spécial"
    }));

    const completedChallenges = userChallenges.filter(uc => uc.status === "completed").map(uc => ({
      id: uc.id,
      challengeId: uc.challenge_id,
      title: uc.challenge.name,
      description: uc.challenge.description || "",
      completedDate: uc.end_date?.toISOString() || null,
      badge: uc.challenge.rewardBadge?.icon || "🏆",
      reward: uc.challenge.rewardBadge?.name || "Badge spécial"
    }));

    // Identifier les challenges que l'utilisateur n'a pas encore démarrés
    const userChallengeIds = userChallenges.map(uc => uc.challenge_id);
    const availableChallenges = allChallenges
      .filter(challenge => !userChallengeIds.includes(challenge.id))
      .map(challenge => ({
        id: challenge.id,
        title: challenge.name,
        description: challenge.description || "",
        difficulty: challenge.difficulty as string || "Moyenne",
        duration: challenge.duration ? `${challenge.duration} jours` : "Non défini",
        badge: challenge.rewardBadge?.icon || "🏆",
        reward: challenge.rewardBadge?.name || "Badge spécial"
      }));

    // Calculer des statistiques
    const stats = {
      completedCount: completedChallenges.length,
      inProgressCount: inProgressChallenges.length,
      badgesEarned: completedChallenges.length // Chaque challenge complété = 1 badge
    };

    return NextResponse.json({
      available: availableChallenges,
      inProgress: inProgressChallenges,
      completed: completedChallenges,
      stats
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des challenges:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des challenges." },
      { status: 500 }
    );
  }
} 