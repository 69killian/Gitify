import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Liste des pages de l'application pour la recherche
const appPages = [
  { title: "Accueil", path: "/" },
  { title: "Profil", path: "/profil" },
  { title: "Badges", path: "/badges" },
  { title: "Streak", path: "/streak" },
  { title: "Contributions", path: "/contributions" },
  { title: "Défis", path: "/defis" },
  { title: "Classement", path: "/classement" },
  { title: "Événements", path: "/evenements" },
  { title: "Intégrations", path: "/integrations" },
  { title: "Support", path: "/support" },
  { title: "Guide", path: "/guide" },
  { title: "Réseaux", path: "/reseaux" },
];

export async function GET(req: NextRequest) {
  try {
    // Récupérer le terme de recherche
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q");
    console.log("Recherche API - q:", q);
    
    if (!q || q.trim() === "") {
      return NextResponse.json({
        badges: [],
        challenges: [],
        pages: [],
      });
    }

    // Rechercher dans les badges
    const badges = await prisma.badge.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5, // Limiter à 5 résultats pour la performance
    });

    // Rechercher dans les défis
    const challenges = await prisma.challenge.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 5, // Limiter à 5 résultats pour la performance
    });

    // Rechercher dans les pages de l'application
    const pages = appPages.filter(
      (page) =>
        page.title.toLowerCase().includes(q.toLowerCase()) ||
        page.path.toLowerCase().includes(q.toLowerCase())
    );

    console.log("Résultats API - badges:", badges, "challenges:", challenges, "pages:", pages);
    
    return NextResponse.json({
      badges,
      challenges,
      pages,
    });
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la recherche" },
      { status: 500 }
    );
  }
} 