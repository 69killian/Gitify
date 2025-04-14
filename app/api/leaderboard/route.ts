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
      take: 5, // Limiter aux 5 premiers résultats
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
            contributions: true
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
    const formattedContributors = topContributors.map((user, index) => {
      return {
        rank: index + 1,
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        avatar: user.avatar_url || user.image || "https://avatars.githubusercontent.com/u/583231?v=4", // Image par défaut si aucune n'est disponible
        points: user._count.contributions,
        streak: user.streaks[0]?.current_streak || 0
      };
    });

    return NextResponse.json(formattedContributors);
  } catch (error) {
    console.error("Erreur lors de la récupération du leaderboard:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du leaderboard" },
      { status: 500 }
    );
  }
} 