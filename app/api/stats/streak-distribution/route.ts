import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

type StreakDistribution = {
  range: string;
  count: number;
};

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer tous les streaks actifs
    const allStreaks = await prisma.streak.findMany({
      where: {
        is_active: true
      },
      select: {
        longest_streak: true
      }
    });

    // Si aucun streak n'est trouvé, retourner des données par défaut
    if (allStreaks.length === 0) {
      return NextResponse.json({
        distributions: [
          { range: "1-7 jours", count: 0 },
          { range: "8-30 jours", count: 0 },
          { range: "31-90 jours", count: 0 },
          { range: "91+ jours", count: 0 }
        ]
      });
    }

    // Définir les plages pour la distribution
    const ranges = [
      { min: 1, max: 7, name: "1-7 jours" },
      { min: 8, max: 30, name: "8-30 jours" },
      { min: 31, max: 90, name: "31-90 jours" },
      { min: 91, max: Infinity, name: "91+ jours" }
    ];

    // Initialiser les compteurs
    const distribution: Record<string, number> = {};
    ranges.forEach(range => {
      distribution[range.name] = 0;
    });

    // Compter les streaks pour chaque plage
    allStreaks.forEach(streak => {
      const streakDays = streak.longest_streak;
      
      for (const range of ranges) {
        if (streakDays >= range.min && streakDays <= range.max) {
          distribution[range.name]++;
          break;
        }
      }
    });

    // Calculer les pourcentages
    const total = allStreaks.length;
    const distributionPercentages: StreakDistribution[] = Object.entries(distribution).map(([range, count]) => ({
      range,
      count: Math.round((count / total) * 100) // Pourcentage arrondi
    }));

    return NextResponse.json({
      distributions: distributionPercentages
    });

  } catch (error) {
    console.error("Erreur lors du calcul de la distribution des streaks:", error);
    return NextResponse.json(
      { 
        error: "Une erreur est survenue lors du calcul de la distribution des streaks",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 