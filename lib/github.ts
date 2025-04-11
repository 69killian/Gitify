import { Octokit } from '@octokit/rest';
import prisma from './prisma';

// Type pour les contributions formatées
type ContributionData = {
  user_id: string;
  type: 'commit' | 'pr' | 'merge';
  repository: string | null;
  message: string | null;
  date: Date;
  prNumber?: number;
};

/**
 * Récupère les contributions GitHub de l'utilisateur et les synchronise avec la base de données.
 */
export async function syncGitHubContributions(userId: string, accessToken?: string) {
  if (!accessToken) {
    // Si aucun token n'est fourni, essayer de récupérer le token depuis l'intégration GitHub
    const userAccount = await prisma.account.findFirst({
      where: {
        userId: userId,
        provider: 'github',
      },
      select: {
        access_token: true,
      },
    });

    if (!userAccount?.access_token) {
      throw new Error('Aucun token GitHub disponible');
    }

    accessToken = userAccount.access_token;
  }

  const octokit = new Octokit({ auth: accessToken });

  // Récupérer les informations de l'utilisateur pour obtenir le username
  const { data: user } = await octokit.users.getAuthenticated();

  // 1. Récupérer les repositories de l'utilisateur
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 100,
  });

  // Tableaux pour stocker les différents types de contributions
  const allContributions: ContributionData[] = [];

  // 2. Pour chaque repository, récupérer les commits, PRs et merges
  for (const repo of repos) {
    // Ignorer les forks si nécessaire
    if (repo.fork) continue;

    // 2.1 Récupérer les commits
    try {
      const { data: commits } = await octokit.repos.listCommits({
        owner: repo.owner.login,
        repo: repo.name,
        author: user.login,
        per_page: 100,
      });

      // Formatter les commits
      const commitContributions = commits.map((commit) => ({
        user_id: userId,
        type: 'commit' as const,
        repository: repo.name,
        message: commit.commit.message,
        date: new Date(commit.commit.author?.date || commit.commit.committer?.date || new Date()),
      }));

      allContributions.push(...commitContributions);
    } catch (error) {
      console.error(`Erreur lors de la récupération des commits pour ${repo.name}:`, error);
    }

    // 2.2 Récupérer les pull requests
    try {
      const { data: pullRequests } = await octokit.pulls.list({
        owner: repo.owner.login,
        repo: repo.name,
        state: 'all',
        sort: 'updated',
        direction: 'desc',
        per_page: 100,
      });

      // Filter PRs créées par l'utilisateur
      const userPRs = pullRequests.filter(pr => pr.user?.login === user.login);

      // Formatter les PRs
      const prContributions = userPRs.map((pr) => ({
        user_id: userId,
        type: 'pr' as const,
        repository: repo.name,
        message: pr.title,
        date: new Date(pr.created_at),
        prNumber: pr.number,
      }));

      allContributions.push(...prContributions);

      // 2.3 Extraire les merges (PRs qui ont été mergées)
      const mergeContributions = userPRs
        .filter(pr => pr.merged_at)
        .map((pr) => ({
          user_id: userId,
          type: 'merge' as const,
          repository: repo.name,
          message: `Merged PR #${pr.number}: ${pr.title}`,
          date: new Date(pr.merged_at || new Date()),
        }));

      allContributions.push(...mergeContributions);
    } catch (error) {
      console.error(`Erreur lors de la récupération des PRs pour ${repo.name}:`, error);
    }
  }

  // 3. Insérer les contributions dans la base de données
  if (allContributions.length > 0) {
    await prisma.contribution.createMany({
      data: allContributions,
      skipDuplicates: true, // Éviter les doublons basés sur la contrainte unique
    });
  }

  return {
    contributionsCount: allContributions.length,
    commitCount: allContributions.filter(c => c.type === 'commit').length,
    prCount: allContributions.filter(c => c.type === 'pr').length,
    mergeCount: allContributions.filter(c => c.type === 'merge').length,
  };
}

/**
 * Récupère les statistiques de contribution d'un utilisateur
 */
export async function getContributionStats(userId: string) {
  // Compter les contributions par type
  const [commits, pullRequests, merges, repos] = await Promise.all([
    prisma.contribution.count({
      where: { user_id: userId, type: 'commit' }
    }),
    prisma.contribution.count({
      where: { user_id: userId, type: 'pr' }
    }),
    prisma.contribution.count({
      where: { user_id: userId, type: 'merge' }
    }),
    prisma.contribution.groupBy({
      by: ['repository'],
      where: { 
        user_id: userId,
        repository: { not: null }
      }
    })
  ]);

  return {
    commits,
    pullRequests,
    merges,
    repositories: repos.length
  };
} 