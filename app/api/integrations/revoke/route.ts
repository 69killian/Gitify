import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function POST() {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // 2. Récupérer l'ID de l'utilisateur
    const userId = session.user.id;

    // 3. Vérifier que l'intégration GitHub existe pour cet utilisateur
    const integration = await prisma.integration.findFirst({
      where: {
        user_id: userId,
        service: "GitHub",
        status: "Connecté"
      }
    });

    if (!integration) {
      return NextResponse.json({ 
        error: "Intégration GitHub introuvable" 
      }, { status: 404 });
    }

    // 4. Effectuer la suppression en cascade des données de l'utilisateur
    // Note: En fonction de vos besoins, vous pourriez préférer une logique différente
    // Par exemple, désactiver le compte plutôt que le supprimer, ou conserver certaines données
    await prisma.$transaction([
      // Suppression des relations/dépendances
      prisma.userBadge.deleteMany({
        where: { user_id: userId }
      }),
      prisma.userChallenge.deleteMany({
        where: { user_id: userId }
      }),
      prisma.contribution.deleteMany({
        where: { user_id: userId }
      }),
      prisma.streak.deleteMany({
        where: { user_id: userId }
      }),
      prisma.feedback.deleteMany({
        where: { user_id: userId }
      }),
      prisma.integration.deleteMany({
        where: { user_id: userId }
      }),
      prisma.account.deleteMany({
        where: { userId: userId }
      }),
      prisma.session.deleteMany({
        where: { userId: userId }
      }),
      // Finalement, supprimer l'utilisateur lui-même
      prisma.user.delete({
        where: { id: userId }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: "Intégration GitHub et compte utilisateur supprimés avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la révocation de l'intégration GitHub:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors de la révocation de l'intégration GitHub",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 