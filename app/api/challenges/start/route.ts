import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Récupérer le corps de la requête
    const body = await request.json();
    const { challengeId } = body;
    
    if (!challengeId) {
      return NextResponse.json({ error: "ID de défi manquant" }, { status: 400 });
    }

    // Vérifier si le défi existe
    const challenge = await prisma.challenge.findUnique({
      where: {
        id: challengeId
      }
    });

    if (!challenge) {
      return NextResponse.json({ error: "Défi introuvable" }, { status: 404 });
    }

    // Vérifier si l'utilisateur a déjà commencé ce défi
    const existingUserChallenge = await prisma.userChallenge.findFirst({
      where: {
        user_id: userId,
        challenge_id: challengeId,
        status: {
          in: ["in_progress", "completed"]
        }
      }
    });

    if (existingUserChallenge) {
      return NextResponse.json({ 
        error: "Vous avez déjà commencé ou complété ce défi" 
      }, { status: 409 });
    }

    // Créer un nouveau UserChallenge
    const userChallenge = await prisma.userChallenge.create({
      data: {
        user_id: userId,
        challenge_id: challengeId,
        start_date: new Date(),
        progress: 0,
        status: "in_progress"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Défi commencé avec succès",
      userChallenge
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du défi:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors du démarrage du défi",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 