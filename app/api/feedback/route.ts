import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// GET: Récupérer les feedbacks de l'utilisateur connecté
export async function GET() {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour accéder à vos feedbacks" },
      { status: 401 }
    );
  }

  try {
    // 2. Récupérer l'ID de l'utilisateur
    const userId = session.user.id;

    // 3. Récupérer tous les feedbacks de l'utilisateur
    const feedbacks = await prisma.feedback.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        status: true,
        screenshots: true,
        created_at: true,
      }
    });

    // 4. Transformer les données pour le frontend
    const formattedFeedbacks = feedbacks.map((feedback) => ({
      id: feedback.id,
      type: feedback.type,
      title: feedback.title,
      description: feedback.description,
      status: feedback.status,
      screenshots: feedback.screenshots,
      date: feedback.created_at,
    }));

    // 5. Renvoyer les feedbacks
    return NextResponse.json(formattedFeedbacks);
  } catch (error) {
    console.error("Erreur lors de la récupération des feedbacks:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des feedbacks" },
      { status: 500 }
    );
  }
}

// POST: Créer un nouveau feedback
export async function POST(request: Request) {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour soumettre un feedback" },
      { status: 401 }
    );
  }

  try {
    // 2. Récupérer les données du corps de la requête
    const body = await request.json();
    
    // 3. Valider les données
    const { type, title, description, screenshots = [] } = body;
    
    if (!type || !title || !description) {
      return NextResponse.json(
        { error: "Type, titre et description sont requis" },
        { status: 400 }
      );
    }

    // 4. Récupérer l'ID de l'utilisateur
    const userId = session.user.id;

    // 5. Créer le feedback dans la base de données
    const feedback = await prisma.feedback.create({
      data: {
        user_id: userId,
        type,
        title,
        description,
        status: "pending", // Statut par défaut
        screenshots, // Dans un cas réel, ce seraient des URLs vers un service de stockage
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // 6. Renvoyer le feedback créé
    return NextResponse.json(
      {
        id: feedback.id,
        type: feedback.type,
        title: feedback.title,
        description: feedback.description,
        status: feedback.status,
        screenshots: feedback.screenshots,
        date: feedback.created_at
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du feedback:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création du feedback" },
      { status: 500 }
    );
  }
} 