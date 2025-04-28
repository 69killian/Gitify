import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { updateUserStreak, updateUserProgress } from "@/lib/progressService";
import prisma from "@/lib/prisma";

/**
 * POST /api/progress
 * Met à jour la progression de l'utilisateur (streak et challenges)
 */
export async function POST() {
  try {
    // Vérifier l'authentification de l'utilisateur
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour mettre à jour votre progression." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Mettre à jour le streak de l'utilisateur
    const streakResult = await updateUserStreak(userId);

    // Si le streak n'a pas été mis à jour (déjà mis à jour aujourd'hui)
    if ('message' in streakResult && streakResult.message === "streak_already_updated") {
      return NextResponse.json({
        message: "streak_already_updated"
      });
    }

    // Vérifier et mettre à jour la progression des challenges
    const { completedChallenges, awardedBadges } = await updateUserProgress(userId);

    // Retourner les informations actualisées
    return NextResponse.json({
      newStreak: streakResult,
      completedChallenges,
      awardedBadges
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la progression:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour de votre progression." },
      { status: 500 }
    );
  }
}

/**
 * GET /api/progress
 * Récupère la progression actuelle de l'utilisateur
 */
export async function GET() {
  try {
    // Vérifier l'authentification de l'utilisateur
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour consulter votre progression." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Récupérer le streak actuel
    const streak = await prisma.streak.findFirst({
      where: { user_id: userId, is_active: true },
      orderBy: { created_at: "desc" }
    });

    // Récupérer les challenges en cours
    const inProgressChallenges = await prisma.userChallenge.findMany({
      where: { user_id: userId, status: "in_progress" },
      include: { challenge: true }
    });

    // Récupérer les challenges complétés
    const completedChallenges = await prisma.userChallenge.findMany({
      where: { user_id: userId, status: "completed" },
      include: { challenge: true }
    });

    // Récupérer les badges débloqués
    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: userId },
      include: { badge: true }
    });

    return NextResponse.json({
      streak,
      inProgressChallenges,
      completedChallenges,
      userBadges
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la progression:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération de votre progression." },
      { status: 500 }
    );
  }
} 