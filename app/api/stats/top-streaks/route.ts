import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Calculer le début du mois en cours
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Récupérer tous les streaks actifs
    const activeStreaks = await prisma.streak.findMany({
      where: {
        is_active: true,
        OR: [
          {
            // Streaks qui ont commencé ce mois-ci
            start_date: {
              gte: startOfMonth
            }
          },
          {
            // Streaks qui étaient déjà actifs mais ont continué ce mois-ci
            start_date: {
              lt: startOfMonth
            },
            end_date: null
          }
        ]
      },
      orderBy: {
        current_streak: 'desc'
      },
      take: 5,
      select: {
        user_id: true,
        current_streak: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true
          }
        }
      }
    });

    // Si aucun streak n'est trouvé, retourner des données vides
    if (activeStreaks.length === 0) {
      return NextResponse.json({
        topStreaks: []
      });
    }

    // Formater la réponse
    const formattedTopStreaks = activeStreaks.map(streak => ({
      userId: streak.user.id,
      name: streak.user.name || streak.user.username,
      username: streak.user.username,
      streak: streak.current_streak
    }));

    return NextResponse.json({
      topStreaks: formattedTopStreaks
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des meilleurs streaks:", error);
    return NextResponse.json(
      { 
        error: "Une erreur est survenue lors de la récupération des meilleurs streaks",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 