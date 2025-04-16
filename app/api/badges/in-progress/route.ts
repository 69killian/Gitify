import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import prisma from "@/lib/prisma";

// Type pour la progression d'un badge
interface BadgeProgress {
  name: string;
  current: number;
  target: number;
  progress: number;
  icon?: string | null;
  description?: string | null;
}

// Mapping des badges et de leurs conditions
const BADGE_TARGET_MAPPING = {
  // Badges de Streak
  "Streak Newbie": { target: 3, type: "streak" },
  "Streak Enthusiast": { target: 7, type: "streak" },
  "Streak Warrior": { target: 15, type: "streak" },
  "Streak Master": { target: 30, type: "streak" },
  "Streak God": { target: 100, type: "streak" },
  
  // Badges de Contributions/Commits
  "First Commit": { target: 1, type: "commit" },
  "Contributor": { target: 10, type: "commit" },
  "Code Machine": { target: 100, type: "commit" },
  "Code Addict": { target: 500, type: "commit" },
  "Code Legend": { target: 1000, type: "commit" },
  
  // Badges Pull Requests
  "First PR": { target: 1, type: "pr" },
  "Merge Master": { target: 5, type: "pr" },
  "PR Hero": { target: 10, type: "pr" },
  "Open Source Champion": { target: 20, type: "pr" },
  
  // Badges Open Source Repos
  "Public Repo": { target: 1, type: "repo" },
  "Open Source Addict": { target: 3, type: "repo" },
  "OSS Rockstar": { target: 10, type: "repo" }
};

export async function GET() {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Vous devez être connecté pour accéder à cette ressource." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Récupérer les badges que l'utilisateur possède déjà
    const userBadges = await prisma.userBadge.findMany({
      where: { user_id: userId },
      include: { badge: true }
    });
    
    // Créer un Set pour un accès rapide aux noms de badges déjà débloqués
    const unlockedBadgeNames = new Set(userBadges.map(ub => ub.badge.name));

    // Récupérer tous les badges disponibles dans le système
    const allBadges = await prisma.badge.findMany();
    
    // Récupérer les statistiques actuelles de l'utilisateur
    // 1. Streak actuel
    const userStreak = await prisma.streak.findFirst({
      where: { 
        user_id: userId,
        is_active: true
      },
      orderBy: { updated_at: 'desc' }
    });
    
    const currentStreak = userStreak?.current_streak || 0;
    
    // 2. Nombre de commits
    const commitsCount = await prisma.contribution.count({
      where: {
        user_id: userId,
        type: 'commit'
      }
    });
    
    // 3. Nombre de PRs
    const pullRequestsCount = await prisma.contribution.count({
      where: {
        user_id: userId,
        type: 'pr'
      }
    });
    
    // 4. Nombre de dépôts uniques
    const repositories = await prisma.contribution.groupBy({
      by: ['repository'],
      where: {
        user_id: userId,
        repository: { not: null }
      }
    });
    
    const reposCount = repositories.length;

    // Calculer la progression pour chaque badge que l'utilisateur n'a pas encore débloqué
    const badgesProgress: BadgeProgress[] = [];
    
    // Variables pour calculer la progression totale
    let totalProgressSum = 0;
    let totalBadgesCount = 0;
    
    for (const badge of allBadges) {
      // Si le badge est déjà débloqué, sa progression est de 100%
      if (unlockedBadgeNames.has(badge.name)) {
        totalProgressSum += 100;
        totalBadgesCount++;
        continue;
      }
      
      // Vérifier si le badge est dans notre mapping
      const badgeConfig = BADGE_TARGET_MAPPING[badge.name as keyof typeof BADGE_TARGET_MAPPING];
      if (!badgeConfig) {
        continue; // Ignorer les badges sans configuration
      }
      
      let current = 0;
      const target = badgeConfig.target;
      
      // Déterminer la valeur actuelle en fonction du type de badge
      switch (badgeConfig.type) {
        case "streak":
          current = currentStreak;
          break;
        case "commit":
          current = commitsCount;
          break;
        case "pr":
          current = pullRequestsCount;
          break;
        case "repo":
          current = reposCount;
          break;
        default:
          continue; // Ignorer les types non pris en charge
      }
      
      // Calculer le pourcentage de progression (plafonné à 100%)
      const progress = Math.min(Math.round((current / target) * 100), 100);
      
      // Ajouter au calcul de la progression totale
      totalProgressSum += progress;
      totalBadgesCount++;
      
      // N'ajouter que les badges avec une progression > 0 et < 100% pour l'affichage
      if (progress > 0 && progress < 100) {
        badgesProgress.push({
          name: badge.name,
          current,
          target,
          progress,
          icon: badge.icon,
          description: badge.description
        });
      }
    }
    
    // Calculer la progression totale (moyenne des progressions individuelles)
    const totalProgress = totalBadgesCount > 0 
      ? Math.round(totalProgressSum / totalBadgesCount) 
      : 0;
    
    // Trier par progression (décroissante)
    badgesProgress.sort((a, b) => b.progress - a.progress);
    
    // Limiter à 3 badges pour ne pas surcharger l'interface
    const topBadgesInProgress = badgesProgress.slice(0, 3);
    
    return NextResponse.json({
      badgesInProgress: topBadgesInProgress,
      totalProgress: totalProgress
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des badges en cours:", error);
    return NextResponse.json(
      { 
        error: "Une erreur est survenue lors de la récupération des badges en cours.",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 