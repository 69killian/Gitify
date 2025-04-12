import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;

    // Récupérer tous les défis existants
    const allChallenges = await prisma.challenge.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        difficulty: true,
        duration: true,
        reward_badge_id: true,
        rewardBadge: {
          select: {
            name: true,
            icon: true
          }
        }
      }
    });

    // Récupérer les défis de l'utilisateur
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

    // Séparer les défis en cours et complétés
    const inProgressChallenges = userChallenges.filter(uc => uc.status === "in_progress");
    const completedChallenges = userChallenges.filter(uc => uc.status === "completed");

    // Identifier les défis disponibles (non commencés par l'utilisateur)
    const startedChallengeIds = userChallenges.map(uc => uc.challenge_id);
    const availableChallenges = allChallenges.filter(challenge => 
      !startedChallengeIds.includes(challenge.id)
    );

    // Récupérer le nombre de badges gagnés
    const badgesEarned = await prisma.userBadge.count({
      where: {
        user_id: userId
      }
    });

    // Formater et renvoyer la réponse
    return NextResponse.json({
      available: availableChallenges.map(challenge => ({
        id: challenge.id,
        title: challenge.name,
        description: challenge.description || "",
        difficulty: challenge.difficulty || "Moyen",
        duration: `${challenge.duration || 7} jours`,
        badge: challenge.rewardBadge?.icon || "🏆",
        reward: `${challenge.rewardBadge?.icon || "🏆"} Badge ${challenge.rewardBadge?.name || challenge.name}`
      })),
      inProgress: inProgressChallenges.map(uc => ({
        id: uc.id,
        challengeId: uc.challenge_id,
        title: uc.challenge.name,
        description: uc.challenge.description || "",
        progress: uc.progress,
        startDate: uc.start_date,
        // Calculer le temps restant en jours
        timeLeft: uc.challenge.duration 
          ? `${Math.max(0, uc.challenge.duration - Math.floor((new Date().getTime() - new Date(uc.start_date).getTime()) / (1000 * 60 * 60 * 24)))} jours` 
          : "En cours",
        badge: uc.challenge.rewardBadge?.icon || "🏆",
        reward: `${uc.challenge.rewardBadge?.icon || "🏆"} Badge ${uc.challenge.rewardBadge?.name || uc.challenge.name}`
      })),
      completed: completedChallenges.map(uc => ({
        id: uc.id,
        challengeId: uc.challenge_id,
        title: uc.challenge.name,
        description: uc.challenge.description || "",
        completedDate: uc.end_date,
        badge: uc.challenge.rewardBadge?.icon || "🏆",
        reward: `${uc.challenge.rewardBadge?.icon || "🏆"} Badge ${uc.challenge.rewardBadge?.name || uc.challenge.name}`
      })),
      stats: {
        completedCount: completedChallenges.length,
        inProgressCount: inProgressChallenges.length,
        badgesEarned
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des défis:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des défis",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 