import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

/**
 * POST /api/challenges/start
 * Démarre un nouveau challenge pour l'utilisateur connecté
 */
export async function POST(request: Request) {
  try {
    // Vérifier l'authentification de l'utilisateur
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour démarrer un challenge." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();
    const { challengeId } = body;

    if (!challengeId) {
      return NextResponse.json(
        { error: "L'ID du challenge est requis." },
        { status: 400 }
      );
    }

    // Vérifier si le challenge existe
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Ce challenge n'existe pas." },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur a déjà démarré ce challenge
    const existingUserChallenge = await prisma.userChallenge.findFirst({
      where: {
        user_id: userId,
        challenge_id: challengeId,
        status: { in: ["in_progress", "completed"] }
      }
    });

    if (existingUserChallenge) {
      return NextResponse.json(
        { 
          error: existingUserChallenge.status === "completed" 
            ? "Vous avez déjà complété ce challenge." 
            : "Vous avez déjà démarré ce challenge." 
        },
        { status: 400 }
      );
    }

    // Créer un nouveau UserChallenge
    const userChallenge = await prisma.userChallenge.create({
      data: {
        user_id: userId,
        challenge_id: challengeId,
        status: "in_progress",
        progress: 0,
        start_date: new Date()
      }
    });

    return NextResponse.json({
      message: "Challenge démarré avec succès.",
      userChallenge
    });
  } catch (error) {
    console.error("Erreur lors du démarrage du challenge:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du démarrage du challenge." },
      { status: 500 }
    );
  }
} 