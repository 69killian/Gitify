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

    // Récupérer tous les utilisateurs avec leurs données
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
      
      // Même formule que dans l'API leaderboard
      const score = (streak * 3) + points + (badges * 5) + (challenges * 2);
      
      return {
        user,
        score
      };
    });
    
    // Trier tous les utilisateurs par score
    const sortedUsers = usersWithScores.sort((a, b) => b.score - a.score);
    
    // Les 3 premiers utilisateurs pour le podium
    const top3 = sortedUsers.slice(0, 3);

    // Formater les données pour le podium
    const formattedPodium = top3.map((item, index) => {
      const user = item.user;
      return {
        rank: index + 1,
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        avatar: user.avatar_url || user.image || "https://avatars.githubusercontent.com/u/583231?v=4",
        points: user._count.contributions,
        streak: user.streaks[0]?.current_streak || 0,
        badges: user._count.userBadges,
        challenges: user._count.userChallenges,
        score: item.score
      };
    });

    // Trouver l'utilisateur courant dans la liste triée
    const currentUserWithScore = sortedUsers.find(user => user.user.id === userId);
    
    if (!currentUserWithScore) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }
    
    // Calculer le rang de l'utilisateur (sa position dans la liste triée + 1)
    const userRank = sortedUsers.findIndex(user => user.user.id === userId) + 1;
    
    // Créer les statistiques de l'utilisateur
    const user = currentUserWithScore.user;
    const userStats = {
      id: user.id,
      username: user.username,
      name: user.name || user.username,
      avatar: user.avatar_url || user.image || "https://avatars.githubusercontent.com/u/583231?v=4",
      rank: userRank,
      points: user._count.contributions,
      badges: user._count.userBadges,
      challenges: user._count.userChallenges,
      score: currentUserWithScore.score,
      currentStreak: user.streaks[0]?.current_streak || 0,
      longestStreak: user.streaks[0]?.longest_streak || 0,
    };

    // Retourner les données combinées
    return NextResponse.json({
      podium: formattedPodium,
      userStats: userStats
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des données du podium:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des données",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 