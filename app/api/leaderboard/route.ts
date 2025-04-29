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

    // Récupérer tous les utilisateurs avec leurs statistiques
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        avatar_url: true,
        image: true,
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
            userBadges: true,
            userChallenges: true
          }
        }
      }
    });

    // Calculer le score pour chaque utilisateur
    const usersWithScores = allUsers.map(user => {
      const streak = user.streaks[0]?.current_streak || 0;
      const points = user._count.contributions;
      const badges = user._count.userBadges;
      const challenges = user._count.userChallenges;
      const score = (streak * 3) + points + (badges * 5) + (challenges * 2);
      
      return {
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        avatar: user.avatar_url || user.image || "https://avatars.githubusercontent.com/u/583231?v=4",
        points,
        streak,
        badges,
        challenges,
        score
      };
    });

    // Trier par score et ajouter le rang
    const rankedUsers = usersWithScores
      .sort((a, b) => b.score - a.score)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    return NextResponse.json(rankedUsers);

  } catch (error) {
    console.error("Erreur lors de la récupération du classement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
} 