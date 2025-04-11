import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET() {
  // 1. Obtenir la session
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // 2. Récupérer l'ID de l'utilisateur
    const userId = session.user.id;

    // 3. Compter les contributions par type
    const totalCommits = await prisma.contribution.count({
      where: { user_id: userId, type: "commit" }
    });

    const totalPullRequests = await prisma.contribution.count({
      where: { user_id: userId, type: "pr" }
    });

    const totalMerges = await prisma.contribution.count({
      where: { user_id: userId, type: "merge" }
    });

    // 4. Obtenir le nombre de repositories distincts
    const repositories = await prisma.contribution.groupBy({
      by: ["repository"],
      where: { 
        user_id: userId,
        repository: { not: null }
      }
    });
    const totalRepos = repositories.length;

    // 5. Récupérer les 3 dernières contributions
    const lastContributions = await prisma.contribution.findMany({
      where: { user_id: userId },
      orderBy: { date: "desc" },
      take: 3,
      select: {
        type: true,
        repository: true,
        message: true,
        date: true
      }
    });

    // 6. Récupérer les top repositories 
    // Note: Pour calculer les étoiles, nous allons utiliser une approche simplifiée
    // basée sur le nombre de contributions par repository
    const topRepositoriesData = await prisma.contribution.groupBy({
      by: ["repository"],
      where: { 
        user_id: userId,
        repository: { not: null }
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: "desc"
        }
      },
      take: 3
    });

    // Transformer les données pour obtenir un format plus facile à utiliser
    const topRepositories = await Promise.all(
      topRepositoriesData.map(async (repo: { repository: string | null }) => {
        const commitCount = await prisma.contribution.count({
          where: {
            user_id: userId,
            repository: repo.repository,
            type: "commit"
          }
        });

        // Simuler un nombre d'étoiles (dans un cas réel, cette information proviendrait de l'API GitHub)
        // Pour l'instant, nous utilisons un nombre aléatoire entre 0 et 50
        const stars = Math.floor(Math.random() * 50);

        return {
          name: repo.repository,
          commits: commitCount,
          stars: stars
        };
      })
    );

    // 7. Retourner toutes les données
    return NextResponse.json({
      totalCommits,
      totalPullRequests,
      totalMerges,
      totalRepos,
      lastContributions,
      topRepositories
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
} 