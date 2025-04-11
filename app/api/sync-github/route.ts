import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { syncGitHubContributions } from "@/lib/github";

export async function POST() {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // 2. Récupérer l'ID de l'utilisateur
    const userId = session.user.id;
    const accessToken = session.accessToken as string;

    // 3. Synchroniser les contributions GitHub
    const result = await syncGitHubContributions(userId, accessToken);

    // 4. Retourner les statistiques de synchronisation
    return NextResponse.json({
      success: true,
      message: `Synchronisation réussie : ${result.contributionsCount} contributions récupérées`,
      stats: {
        commits: result.commitCount,
        pullRequests: result.prCount,
        merges: result.mergeCount
      }
    });
  } catch (error) {
    console.error("Erreur lors de la synchronisation des contributions GitHub:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors de la synchronisation des contributions GitHub",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 