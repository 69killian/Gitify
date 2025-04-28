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

    // Récupérer le top 3 des utilisateurs par score composite
    const podiumUsers = await prisma.user.findMany({
      take: 3, // Limiter aux 3 premiers résultats
      select: {
        id: true,
        name: true,
        username: true,
        avatar_url: true,
        image: true, // Fallback si avatar_url est null
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

    // Transformation des données avec calcul du score
    const podiumWithScores = podiumUsers.map(user => {
      // Extraire les valeurs
      const streak = user.streaks[0]?.current_streak || 0;
      const points = user._count.contributions;
      const badges = user._count.userBadges;
      const challenges = user._count.userChallenges;
      
      // Calculer le score composite
      const score = (streak * 3) + points + (badges * 5) + (challenges * 2);
      
      return {
        user,
        score
      };
    });
    
    // Trier par score et limiter aux 3 premiers
    const top3 = podiumWithScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    // Transformation des données pour le format attendu par le frontend
    const formattedPodium = top3.map((item, index) => {
      const user = item.user;
      return {
        rank: index + 1,
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        avatar: user.avatar_url || user.image || "https://avatars.githubusercontent.com/u/583231?v=4", // Image par défaut
        points: user._count.contributions,
        streak: user.streaks[0]?.current_streak || 0,
        badges: user._count.userBadges,
        challenges: user._count.userChallenges,
        score: item.score
      };
    });

    // Obtenir les statistiques de l'utilisateur connecté
    // 1. Récupérer les informations de l'utilisateur
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
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

    if (!currentUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // Calculer le score de l'utilisateur
    const userStreak = currentUser.streaks[0]?.current_streak || 0;
    const userPoints = currentUser._count.contributions;
    const userBadges = currentUser._count.userBadges;
    const userChallenges = currentUser._count.userChallenges;
    const userScore = (userStreak * 3) + userPoints + (userBadges * 5) + (userChallenges * 2);
    
    // 2. Calculer le rang de l'utilisateur en fonction du score composite
    // Récupérer tous les utilisateurs pour calculer leur score et déterminer le rang
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
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
    
    // Calculer les scores de tous les utilisateurs
    const usersWithScores = allUsers.map(user => {
      const streak = user.streaks[0]?.current_streak || 0;
      const points = user._count.contributions;
      const badges = user._count.userBadges;
      const challenges = user._count.userChallenges;
      const score = (streak * 3) + points + (badges * 5) + (challenges * 2);
      
      return {
        id: user.id,
        score
      };
    });
    
    // Compter combien d'utilisateurs ont un score plus élevé
    const usersWithHigherScore = usersWithScores.filter(user => 
      user.id !== currentUser.id && user.score > userScore
    ).length;
    
    // Le rang est le nombre d'utilisateurs avec un score plus élevé + 1
    const userRank = usersWithHigherScore + 1;

    // 3. Formater les statistiques de l'utilisateur
    const userStats = {
      id: currentUser.id,
      username: currentUser.username,
      name: currentUser.name || currentUser.username,
      avatar: currentUser.avatar_url || currentUser.image || "https://avatars.githubusercontent.com/u/583231?v=4",
      rank: userRank,
      points: userPoints,
      badges: userBadges,
      challenges: userChallenges,
      score: userScore,
      currentStreak: userStreak,
      longestStreak: currentUser.streaks[0]?.longest_streak || 0,
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