import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// GET: Récupérer tous les feedbacks (réservé aux administrateurs)
export async function GET() {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour accéder à cette ressource" },
      { status: 401 }
    );
  }

  // 2. Vérifier les droits d'admin (uniquement pour l'utilisateur avec github_id 145566954)
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { github_id: true }
  });
  
  // Vérifier si l'utilisateur est l'administrateur spécifique
  const isAdmin = user?.github_id === "145566954";
  
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Vous n'avez pas les autorisations nécessaires pour accéder à cette ressource" },
      { status: 403 }
    );
  }

  try {
    // 3. Récupérer tous les feedbacks avec les informations utilisateur
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
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
      user: feedback.user ? {
        id: feedback.user.id,
        name: feedback.user.name,
        email: feedback.user.email,
        image: feedback.user.image
      } : null
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