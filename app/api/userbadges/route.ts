import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

export async function GET() {
  // 1. Vérifier l'authentification
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // 2. Récupérer l'ID de l'utilisateur
    const userId = session.user.id;

    // 3. Récupérer les userBadges de l'utilisateur en incluant le badge associé
    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: userId },
      include: { badge: true },
      orderBy: { unlocked_at: "desc" }
    });

    // 4. Retourner les données
    return NextResponse.json(userBadges);
  } catch (error) {
    console.error("Erreur lors de la récupération des badges :", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des badges" },
      { status: 500 }
    );
  }
} 