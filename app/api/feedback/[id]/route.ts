import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// Interface pour les paramètres de route
interface Params {
  params: {
    id: string;
  };
}

// Fonction utilitaire pour vérifier si l'utilisateur est un administrateur
async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { github_id: true }
  });
  
  // Vérifier si l'utilisateur a le github_id spécifique
  return user?.github_id === "145566954";
}

// GET: Récupérer un feedback spécifique
export async function GET(request: Request, { params }: Params) {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour accéder aux feedbacks" },
      { status: 401 }
    );
  }

  try {
    // 2. Récupérer l'ID du feedback
    const feedbackId = Number(params.id);
    
    if (isNaN(feedbackId)) {
      return NextResponse.json(
        { error: "ID de feedback invalide" },
        { status: 400 }
      );
    }

    // 3. Récupérer le feedback
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
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

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback non trouvé" },
        { status: 404 }
      );
    }

    // 4. Vérifier les autorisations (seul le propriétaire ou un admin peut voir le feedback)
    const isAdmin = await isUserAdmin(session.user.id);
    const isOwner = feedback.user_id === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à accéder à ce feedback" },
        { status: 403 }
      );
    }

    // 5. Renvoyer le feedback
    return NextResponse.json({
      id: feedback.id,
      type: feedback.type,
      title: feedback.title,
      description: feedback.description,
      status: feedback.status,
      screenshots: feedback.screenshots,
      date: feedback.created_at,
      user: feedback.user
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du feedback:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération du feedback" },
      { status: 500 }
    );
  }
}

// PATCH: Mettre à jour le statut d'un feedback
export async function PATCH(request: Request, { params }: Params) {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour mettre à jour un feedback" },
      { status: 401 }
    );
  }

  try {
    // 2. Récupérer l'ID du feedback
    const feedbackId = Number(params.id);
    
    if (isNaN(feedbackId)) {
      return NextResponse.json(
        { error: "ID de feedback invalide" },
        { status: 400 }
      );
    }

    // 3. Récupérer les données du corps de la requête
    const body = await request.json();
    const { status } = body;
    
    if (!status) {
      return NextResponse.json(
        { error: "Le statut est requis" },
        { status: 400 }
      );
    }

    // Valider le statut
    const validStatuses = ["pending", "En cours", "Résolu", "Répondu"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Statut invalide" },
        { status: 400 }
      );
    }

    // 4. Récupérer le feedback existant pour vérification
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback non trouvé" },
        { status: 404 }
      );
    }

    // 5. Vérifier les autorisations (seul un admin peut mettre à jour le statut)
    const isAdmin = await isUserAdmin(session.user.id);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à mettre à jour ce feedback" },
        { status: 403 }
      );
    }

    // 6. Mettre à jour le feedback
    const updatedFeedback = await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        status,
        updated_at: new Date()
      }
    });

    // 7. Renvoyer le feedback mis à jour
    return NextResponse.json({
      id: updatedFeedback.id,
      type: updatedFeedback.type,
      title: updatedFeedback.title,
      status: updatedFeedback.status,
      date: updatedFeedback.updated_at
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du feedback:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la mise à jour du feedback" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un feedback
export async function DELETE(request: Request, { params }: Params) {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour supprimer un feedback" },
      { status: 401 }
    );
  }

  try {
    // 2. Récupérer l'ID du feedback
    const feedbackId = Number(params.id);
    
    if (isNaN(feedbackId)) {
      return NextResponse.json(
        { error: "ID de feedback invalide" },
        { status: 400 }
      );
    }

    // 3. Récupérer le feedback existant pour vérification
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId }
    });

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback non trouvé" },
        { status: 404 }
      );
    }

    // 4. Vérifier les autorisations (seul un admin ou le propriétaire peut supprimer)
    const isAdmin = await isUserAdmin(session.user.id);
    const isOwner = feedback.user_id === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à supprimer ce feedback" },
        { status: 403 }
      );
    }

    // 5. Supprimer le feedback
    await prisma.feedback.delete({
      where: { id: feedbackId }
    });

    // 6. Renvoyer une confirmation
    return NextResponse.json(
      { message: "Feedback supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du feedback:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la suppression du feedback" },
      { status: 500 }
    );
  }
} 