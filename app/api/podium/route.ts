import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// Type pour le résultat de la requête SQL raw
type CountResult = {
  count: bigint;
}

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;

    // Récupérer le top 3 des utilisateurs par nombre de contributions (podium)
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
            userBadges: true
          }
        }
      },
      orderBy: {
        contributions: {
          _count: "desc"
        }
      }
    });

    // Transformation des données pour le format attendu par le frontend
    const formattedPodium = podiumUsers.map((user, index) => {
      return {
        rank: index + 1,
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        avatar: user.avatar_url || user.image || "https://avatars.githubusercontent.com/u/583231?v=4", // Image par défaut
        points: user._count.contributions,
        streak: user.streaks[0]?.current_streak || 0,
        badges: user._count.userBadges
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
            userBadges: true
          }
        }
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // 2. Calculer le rang de l'utilisateur en comptant tous les utilisateurs ayant plus de contributions
    const userPoints = currentUser._count.contributions;
    
    // Requête pour trouver combien d'utilisateurs ont plus de contributions
    const usersWithMorePoints = await prisma.$queryRaw<CountResult[]>`
      SELECT COUNT(*) as count
      FROM "User" u
      LEFT JOIN (
        SELECT "user_id", COUNT(*) as contribution_count
        FROM "Contribution"
        GROUP BY "user_id"
      ) c ON u.id = c.user_id
      WHERE c.contribution_count > ${userPoints}
    `;
    
    // Le rang est le nombre d'utilisateurs avec plus de points + 1
    const userRank = Number(usersWithMorePoints[0].count) + 1;

    // 3. Formater les statistiques de l'utilisateur
    const userStats = {
      id: currentUser.id,
      username: currentUser.username,
      name: currentUser.name || currentUser.username,
      avatar: currentUser.avatar_url || currentUser.image || "https://avatars.githubusercontent.com/u/583231?v=4",
      rank: userRank,
      points: currentUser._count.contributions,
      badges: currentUser._count.userBadges,
      currentStreak: currentUser.streaks[0]?.current_streak || 0,
      longestStreak: currentUser.streaks[0]?.longest_streak || 0,
      // Autres statistiques pertinentes à ajouter si besoin
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