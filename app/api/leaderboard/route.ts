import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Vérification optionnelle de l'authentification
    // Si vous souhaitez restreindre l'accès à cette API
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupération des top contributeurs
    // Nous utilisons une requête pour récupérer les utilisateurs avec le compte de leurs contributions
    const topContributors = await prisma.user.findMany({
      take: 25, // Récupérer 25 utilisateurs pour afficher un classement plus complet
      select: {
        id: true,
        name: true,
        username: true,
        avatar_url: true,
        image: true, // Pour avoir une image de fallback si avatar_url est null
        streaks: {
          where: {
            is_active: true
          },
          orderBy: {
            current_streak: "desc"
          },
          take: 1,
          select: {
            current_streak: true,
            longest_streak: true
          }
        },
        _count: {
          select: {
            contributions: true,
            userBadges: true,      // Compter le nombre de badges
            userChallenges: true   // Compter le nombre de défis commencés
          }
        }
      }
    });

    // Transformation des données pour le format attendu par le frontend avec calcul d'un score composite
    const formattedContributors = topContributors.map((user) => {
      // Récupérer les données importantes pour le calcul du score
      const streak = user.streaks[0]?.current_streak || 0;
      const points = user._count.contributions;
      const badges = user._count.userBadges;
      const challenges = user._count.userChallenges;
      
      // Calculer un score composite avec pondération
      // Formule : (streakx3) + points + (badgesx5) + (challengesx2)
      // Ces pondérations peuvent être ajustées selon l'importance relative que vous voulez donner à chaque critère
      const score = (streak * 3) + points + (badges * 5) + (challenges * 2);
      
      return {
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        avatar: user.avatar_url || user.image || "https://avatars.githubusercontent.com/u/583231?v=4", // Image par défaut si aucune n'est disponible
        points: points,
        streak: streak,
        badges: badges,
        challenges: challenges,
        score: score
      };
    });

    // Trier les utilisateurs par score et assigner les rangs
    const rankedContributors = formattedContributors
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    return NextResponse.json(rankedContributors);
  } catch (error) {
    console.error("Erreur lors de la récupération du leaderboard:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du leaderboard" },
      { status: 500 }
    );
  }
} 