import prisma from "./prisma";
import { Streak, Badge, Challenge } from "@prisma/client";

/**
 * Met à jour le streak de l'utilisateur
 * @param userId ID de l'utilisateur
 * @returns Le streak mis à jour ou créé
 */
export async function updateUserStreak(userId: string): Promise<Streak | { message: string }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Récupérer le dernier streak de l'utilisateur
  const latestStreak = await prisma.streak.findFirst({
    where: { 
      user_id: userId, 
      is_active: true,
      // Vérifier si le streak a déjà été mis à jour aujourd'hui
      updated_at: {
        gte: today,
        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    },
    orderBy: { created_at: "desc" },
  });

  // Si le streak a déjà été mis à jour aujourd'hui, retourner un message
  if (latestStreak) {
    return { message: "streak_already_updated" };
  }

  // Récupérer le dernier streak actif (sans la contrainte de date)
  const currentStreak = await prisma.streak.findFirst({
    where: { user_id: userId, is_active: true },
    orderBy: { created_at: "desc" },
  });

  // Récupérer la dernière contribution de l'utilisateur
  const latestContribution = await prisma.contribution.findFirst({
    where: { user_id: userId },
    orderBy: { date: "desc" },
  });

  // Si aucun streak n'existe, en créer un nouveau
  if (!currentStreak) {
    return prisma.streak.create({
      data: {
        user_id: userId,
        start_date: today,
        current_streak: 1,
        longest_streak: 1,
        is_active: true,
      },
    });
  }

  // Si la dernière contribution date d'aujourd'hui, on incrémente le streak
  if (latestContribution && new Date(latestContribution.date).setHours(0, 0, 0, 0) === today.getTime()) {
    const updatedStreak = currentStreak.current_streak + 1;
    const newLongestStreak = Math.max(updatedStreak, currentStreak.longest_streak);

    return prisma.streak.update({
      where: { id: currentStreak.id },
      data: {
        current_streak: updatedStreak,
        longest_streak: newLongestStreak,
        updated_at: new Date(),
      },
    });
  }

  // Si la dernière contribution date d'hier, on incrémente le streak
  if (latestContribution && new Date(latestContribution.date).setHours(0, 0, 0, 0) === yesterday.getTime()) {
    const updatedStreak = currentStreak.current_streak + 1;
    const newLongestStreak = Math.max(updatedStreak, currentStreak.longest_streak);

    return prisma.streak.update({
      where: { id: currentStreak.id },
      data: {
        current_streak: updatedStreak,
        longest_streak: newLongestStreak,
        updated_at: new Date(),
      },
    });
  }

  // Si la dernière contribution date d'avant-hier ou plus, on crée un nouveau streak
  return prisma.streak.update({
    where: { id: currentStreak.id },
    data: {
      is_active: false,
      end_date: yesterday,
      updated_at: new Date(),
    },
  }).then(() => {
    return prisma.streak.create({
      data: {
        user_id: userId,
        start_date: today,
        current_streak: 1,
        longest_streak: currentStreak.longest_streak,
        is_active: true,
      },
    });
  });
}

/**
 * Met à jour la progression des challenges pour un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Les challenges complétés et badges attribués
 */
export async function updateUserProgress(userId: string): Promise<{ 
  completedChallenges: Challenge[],
  awardedBadges: Badge[] 
}> {
  const completedChallenges: Challenge[] = [];
  const awardedBadges: Badge[] = [];

  // Récupérer les données de l'utilisateur pour les calculs
  const userData = await getUserData(userId);
  
  // Récupérer tous les challenges actifs de l'utilisateur
  const userChallenges = await prisma.userChallenge.findMany({
    where: { 
      user_id: userId,
      status: "in_progress"
    },
    include: {
      challenge: {
        include: {
          rewardBadge: true
        }
      }
    }
  });

  // Pour chaque challenge en cours, vérifier s'il est complété
  for (const userChallenge of userChallenges) {
    const { challenge } = userChallenge;
    let isCompleted = false;
    let progress = 0;

    // Vérifier si le challenge est complété selon son nom/type
    if (challenge.name.includes('Streak') || (challenge.description && challenge.description.includes('streak'))) {
      // Challenges de type Streak
      const { currentStreak } = userData;
      const requiredStreak = challenge.duration || 0;
      progress = Math.min(100, Math.floor((currentStreak / requiredStreak) * 100));
      isCompleted = currentStreak >= requiredStreak;
    } 
    else if (challenge.name.includes('Commit') || (challenge.description && challenge.description.includes('commits'))) {
      // Challenges de type Commit
      const { totalCommits } = userData;
      const requiredCommits = challenge.duration || 0;
      progress = Math.min(100, Math.floor((totalCommits / requiredCommits) * 100));
      isCompleted = totalCommits >= requiredCommits;
    } 
    else if (challenge.name.includes('PR') || challenge.name.includes('Pull Request') ||
             (challenge.description && (challenge.description.includes('PR') || challenge.description.includes('Pull Request')))) {
      // Challenges de type Pull Request
      const { totalPullRequests } = userData;
      const requiredPRs = challenge.duration || 0;
      progress = Math.min(100, Math.floor((totalPullRequests / requiredPRs) * 100));
      isCompleted = totalPullRequests >= requiredPRs;
    } 
    else if (challenge.name.includes('Repo') || challenge.name.includes('Repository') ||
             (challenge.description && (challenge.description.includes('repo') || challenge.description.includes('repos')))) {
      // Challenges de création de repos
      const { totalRepos } = userData;
      const requiredRepos = challenge.duration || 0;
      progress = Math.min(100, Math.floor((totalRepos / requiredRepos) * 100));
      isCompleted = totalRepos >= requiredRepos;
    }
    else if (challenge.name.toLowerCase().includes('fork') ||
             (challenge.description && challenge.description.toLowerCase().includes('forks'))) {
      // Challenges de type Fork / Forking
      const { totalForks } = userData;
      const requiredForks = challenge.duration || 0;
      progress = Math.min(100, Math.floor((totalForks / requiredForks) * 100));
      isCompleted = totalForks >= requiredForks;
    }
    else if (challenge.name.includes('Night Coder')) {
      // Challenge Night Coder (commit entre 2h et 4h)
      isCompleted = userData.hasNightCommit;
      progress = isCompleted ? 100 : 0;
    } 
    else if (challenge.name.includes('Weekend Warrior')) {
      // Challenge Weekend Warrior (commits le weekend)
      isCompleted = userData.hasWeekendCommits;
      progress = isCompleted ? 100 : 0;
    } 
    else if (challenge.name.includes('One Day Madness')) {
      // Challenge One Day Madness (100 commits en 24h)
      isCompleted = userData.hasOneDayMadness;
      progress = isCompleted ? 100 : 0;
    }

    // Mettre à jour la progression du challenge
    await prisma.userChallenge.update({
      where: { id: userChallenge.id },
      data: { progress }
    });

    // Si le challenge est complété, le marquer comme tel
    if (isCompleted) {
      await prisma.userChallenge.update({
        where: { id: userChallenge.id },
        data: {
          status: "completed",
          end_date: new Date(),
          progress: 100
        }
      });

      completedChallenges.push(challenge);

      // Si le challenge a un badge associé, l'attribuer à l'utilisateur
      if (challenge.reward_badge_id) {
        const existingBadge = await prisma.userBadge.findFirst({
          where: {
            user_id: userId,
            badge_id: challenge.reward_badge_id
          }
        });

        // Si l'utilisateur n'a pas déjà ce badge, le lui attribuer
        if (!existingBadge) {
          const badge = await prisma.badge.findUnique({
            where: { id: challenge.reward_badge_id }
          });

          if (badge) {
            await prisma.userBadge.create({
              data: {
                user_id: userId,
                badge_id: badge.id,
                unlocked_at: new Date()
              }
            });
            awardedBadges.push(badge);
          }
        }
      }
    }
  }

  return { completedChallenges, awardedBadges };
}

/**
 * Récupère les données agrégées de l'utilisateur pour calculer les progressions
 */
async function getUserData(userId: string) {
  // Récupérer le streak actuel
  const currentStreak = await prisma.streak.findFirst({
    where: { user_id: userId, is_active: true },
    orderBy: { created_at: "desc" }
  });

  // Récupérer toutes les contributions
  const contributions = await prisma.contribution.findMany({
    where: { user_id: userId }
  });

  // Filtrer par type de contribution
  const commits = contributions.filter(c => c.type === 'commit');
  const pullRequests = contributions.filter(c => c.type === 'pull_request');
  const repoCreations = contributions.filter(c => c.type === 'repo_creation');
  const forks = contributions.filter(c => c.type === 'fork' || c.type === 'forking');

  // Vérifier les commits nocturnes (2h-4h du matin)
  const hasNightCommit = commits.some(commit => {
    const date = new Date(commit.date);
    const hour = date.getHours();
    return hour >= 2 && hour <= 4;
  });

  // Vérifier les commits du weekend
  const hasWeekendCommits = commits.some(commit => {
    const date = new Date(commit.date);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Dimanche, 6 = Samedi
  });

  // Vérifier le One Day Madness (100 commits en 24h)
  // Pour simplifier, on vérifie si l'utilisateur a fait 100 commits le même jour calendaire
  const commitsByDay = commits.reduce((acc, commit) => {
    const dateStr = new Date(commit.date).toDateString();
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const hasOneDayMadness = Object.values(commitsByDay).some(count => count >= 100);

  return {
    currentStreak: currentStreak?.current_streak || 0,
    longestStreak: currentStreak?.longest_streak || 0,
    totalCommits: commits.length,
    totalPullRequests: pullRequests.length,
    totalRepos: repoCreations.length,
    totalForks: forks.length,
    hasNightCommit,
    hasWeekendCommits,
    hasOneDayMadness
  };
} 