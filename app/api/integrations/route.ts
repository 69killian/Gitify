import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
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

    // 3. Récupérer les intégrations de l'utilisateur
    const integrations = await prisma.integration.findMany({
      where: { user_id: userId },
      select: {
        service: true,
        status: true,
        permissions: true,
        created_at: true,
        updated_at: true
      }
    });

    // 4. Déterminer si GitHub est connecté
    const githubIntegration = integrations.find(i => i.service === "GitHub" && i.status === "Connecté");
    const isGithubConnected = !!githubIntegration;

    // 5. Préparer les données à retourner
    const servicesData = [
      {
        name: "GitHub",
        status: isGithubConnected ? "Connecté" : "Non connecté",
        permissions: isGithubConnected 
          ? (githubIntegration.permissions.length > 0 
              ? githubIntegration.permissions.join(", ") 
              : "Lecture et écriture des dépôts publics")
          : "Aucune autorisation accordée",
        icon: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
      },
      /* Used for future integrations
      {
        name: "Discord",
        status: "Non connecté",
        permissions: "Aucune autorisation accordée",
        icon: "https://www.svgrepo.com/show/353655/discord-icon.svg",
      },
      {
        name: "X",
        status: "Non connecté",
        permissions: "Aucune autorisation accordée",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/X_logo_2023_original.svg/300px-X_logo_2023_original.svg.png?20230728155658",
      },
      */
    ];

    return NextResponse.json({
      success: true,
      services: servicesData,
      hasSocialIntegrations: integrations.length > 0
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des intégrations:", error);
    return NextResponse.json(
      { 
        error: "Erreur lors de la récupération des intégrations",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 