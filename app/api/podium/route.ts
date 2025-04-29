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

    // Trier par score et prendre les 3 premiers
    const top3 = usersWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((user, index) => ({
        ...user,
        rank: index + 1
      }));

    // Obtenir les statistiques de l'utilisateur connecté
    const currentUser = usersWithScores.find(user => user.id === userId);
    if (!currentUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Calculer le rang de l'utilisateur
    const userRank = usersWithScores
      .filter(user => user.score > currentUser.score)
      .length + 1;

    // Formater les statistiques de l'utilisateur
    const userStats = {
      ...currentUser,
      rank: userRank,
      currentStreak: currentUser.streak,
      longestStreak: allUsers.find(u => u.id === userId)?.streaks[0]?.longest_streak || 0
    };

    // Retourner les données combinées
    return NextResponse.json({
      podium: top3,
      userStats
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des données du podium:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
} 