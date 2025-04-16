import { updateUserStreak, updateUserProgress } from "../lib/progressService";
import prisma from "../lib/prisma";

// On se sert de Jest pour simuler les appels à Prisma
jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    streak: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    contribution: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    userChallenge: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    userBadge: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    badge: {
      findUnique: jest.fn(),
    },
  },
}));

describe("updateUserStreak", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new streak when none exists", async () => {
    // Aucune streak existante
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.contribution.findFirst as jest.Mock).mockResolvedValue(null);

    const fakeStreak = {
      id: 1,
      user_id: "user1",
      start_date: new Date(),
      current_streak: 1,
      longest_streak: 1,
      is_active: true,
    };
    (prisma.streak.create as jest.Mock).mockResolvedValue(fakeStreak);

    const result = await updateUserStreak("user1");
    expect(result).toEqual(fakeStreak);
  });

  it("should return the existing streak if the latest contribution is today", async () => {
    const today = new Date();
    const fakeStreak = {
      id: 2,
      user_id: "user1",
      start_date: today,
      current_streak: 5,
      longest_streak: 5,
      is_active: true,
    };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreak);
    // La dernière contribution est aujourd'hui
    (prisma.contribution.findFirst as jest.Mock).mockResolvedValue({
      date: today.toISOString(),
    });

    const result = await updateUserStreak("user1");
    expect(result).toEqual(fakeStreak);
  });

  it("should increment the streak if the latest contribution is yesterday", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const fakeStreak = {
      id: 3,
      user_id: "user1",
      start_date: yesterday,
      current_streak: 2,
      longest_streak: 2,
      is_active: true,
    };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreak);
    // La dernière contribution date d'hier
    (prisma.contribution.findFirst as jest.Mock).mockResolvedValue({
      date: yesterday.toISOString(),
    });

    // Simuler l'update
    const updatedStreak = { ...fakeStreak, current_streak: 3, longest_streak: 3 };
    (prisma.streak.update as jest.Mock).mockResolvedValue(updatedStreak);

    const result = await updateUserStreak("user1");
    expect(result).toEqual(updatedStreak);
  });

  it("should reset the streak if the latest contribution is older than yesterday", async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const oldDate = new Date(today);
    oldDate.setDate(oldDate.getDate() - 2);

    const fakeStreak = {
      id: 4,
      user_id: "user1",
      start_date: oldDate,
      current_streak: 5,
      longest_streak: 5,
      is_active: true,
    };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreak);
    // La dernière contribution est ancienne (avant-hier)
    (prisma.contribution.findFirst as jest.Mock).mockResolvedValue({
      date: oldDate.toISOString(),
    });

    // Simuler la fermeture de l'ancien streak, puis la création d'un nouveau
    (prisma.streak.update as jest.Mock).mockResolvedValue({ ...fakeStreak, is_active: false, end_date: yesterday });
    const newStreak = {
      id: 5,
      user_id: "user1",
      start_date: today,
      current_streak: 1,
      longest_streak: fakeStreak.longest_streak,
      is_active: true,
    };
    (prisma.streak.create as jest.Mock).mockResolvedValue(newStreak);

    const result = await updateUserStreak("user1");
    expect(result).toEqual(newStreak);
  });
});

describe("updateUserProgress", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should complete a streak challenge, mark it as completed, and award its badge if conditions are met", async () => {
    // Simuler getUserData via prisma.streak.findFirst et prisma.contribution.findMany pour une challenge de type streak
    const fakeStreakData = { current_streak: 3, longest_streak: 3 };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreakData);
    // Pour ce test, pas de contributions nécessaires pour le streak
    (prisma.contribution.findMany as jest.Mock).mockResolvedValue([]);

    // Créer un userChallenge pour un challenge de type streak
    const challenge = {
      id: 101,
      name: "Streak Newbie Challenge",
      description: "Atteignez un streak de 3 jours.",
      duration: 3,
      reward_badge_id: 1,
      // Le badge associé (rewardBadge) peut être simulé
      rewardBadge: {
        id: 1,
        name: "Streak Newbie",
        description: "Premier streak atteint",
        icon: "🔥",
        category: null,
        condition: "",
        created_at: new Date(),
      },
    };
    const userChallenge = { id: 201, user_id: "user1", challenge };

    (prisma.userChallenge.findMany as jest.Mock).mockResolvedValue([userChallenge]);

    // Simuler l'update de la progression et de la complétion
    (prisma.userChallenge.update as jest.Mock)
      // Premier update pour la mise à jour du progress
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "in_progress" })
      // Second update pour marquer le challenge comme complété
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "completed", end_date: new Date() });

    // Simuler qu'aucun badge n'a déjà été attribué
    (prisma.userBadge.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.badge.findUnique as jest.Mock).mockResolvedValue(challenge.rewardBadge);
    (prisma.userBadge.create as jest.Mock).mockResolvedValue({
      id: 301,
      user_id: "user1",
      badge_id: 1,
      unlocked_at: new Date(),
    });

    const result = await updateUserProgress("user1");
    expect(result.completedChallenges).toHaveLength(1);
    expect(result.awardedBadges).toHaveLength(1);
  });

  it("should update progress for a commit challenge without completing it if conditions are not met", async () => {
    // Simuler getUserData pour un challenge de type commit
    const fakeStreakData = { current_streak: 1, longest_streak: 1 };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreakData);
    // Simuler 5 commits (mais le challenge nécessite 10 commits)
    (prisma.contribution.findMany as jest.Mock).mockResolvedValue([
      { id: 1, type: "commit", date: new Date().toISOString() },
      { id: 2, type: "commit", date: new Date().toISOString() },
      { id: 3, type: "commit", date: new Date().toISOString() },
      { id: 4, type: "commit", date: new Date().toISOString() },
      { id: 5, type: "commit", date: new Date().toISOString() },
    ]);

    const challenge = {
      id: 102,
      name: "Contributor Challenge",
      description: "Faites 10 commits.",
      duration: 10,
      reward_badge_id: 2,
      rewardBadge: {
        id: 2,
        name: "Contributor",
        description: "Faites 10 commits.",
        icon: "✨",
        category: null,
        condition: "",
        created_at: new Date(),
      },
    };
    const userChallenge = { id: 202, user_id: "user1", challenge };

    (prisma.userChallenge.findMany as jest.Mock).mockResolvedValue([userChallenge]);
    // Update seulement de la progression (non complété)
    (prisma.userChallenge.update as jest.Mock).mockResolvedValue({
      ...userChallenge,
      progress: 50,
      status: "in_progress",
    });

    const result = await updateUserProgress("user1");
    expect(result.completedChallenges).toHaveLength(0);
    expect(result.awardedBadges).toHaveLength(0);
  });

  it("should complete a PR challenge if conditions are met", async () => {
    // Simuler getUserData pour un challenge de type pull request
    const fakeStreakData = { current_streak: 1, longest_streak: 1 };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreakData);
    // Simuler 5 pull requests, challenge nécessite 5
    (prisma.contribution.findMany as jest.Mock).mockResolvedValue([
      { id: 1, type: "pull_request", date: new Date().toISOString() },
      { id: 2, type: "pull_request", date: new Date().toISOString() },
      { id: 3, type: "pull_request", date: new Date().toISOString() },
      { id: 4, type: "pull_request", date: new Date().toISOString() },
      { id: 5, type: "pull_request", date: new Date().toISOString() },
    ]);

    const challenge = {
      id: 103,
      name: "Merge Master Challenge",
      description: "Fusionnez 5 PRs.",
      duration: 5,
      reward_badge_id: 3,
      rewardBadge: {
        id: 3,
        name: "Merge Master",
        description: "Fusionnez 5 PRs.",
        icon: "🦸",
        category: null,
        condition: "",
        created_at: new Date(),
      },
    };
    const userChallenge = { id: 203, user_id: "user1", challenge };

    (prisma.userChallenge.findMany as jest.Mock).mockResolvedValue([userChallenge]);
    (prisma.userChallenge.update as jest.Mock)
      // Mise à jour de la progression puis complétion
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "in_progress" })
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "completed", end_date: new Date() });

    (prisma.userBadge.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.badge.findUnique as jest.Mock).mockResolvedValue(challenge.rewardBadge);
    (prisma.userBadge.create as jest.Mock).mockResolvedValue({
      id: 302,
      user_id: "user1",
      badge_id: 3,
      unlocked_at: new Date(),
    });

    const result = await updateUserProgress("user1");
    expect(result.completedChallenges).toHaveLength(1);
    expect(result.awardedBadges).toHaveLength(1);
  });

  it("should complete a Night Coder challenge if conditions are met", async () => {
    // Simuler getUserData pour une challenge Night Coder : il faut un commit entre 2h et 4h
    const fakeStreakData = { current_streak: 1, longest_streak: 1 };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreakData);
    // Simuler un commit à 2h pour satisfaire la condition Night Coder
    const commitDate = new Date();
    commitDate.setHours(2, 0, 0, 0);
    (prisma.contribution.findMany as jest.Mock).mockResolvedValue([
      { id: 10, type: "commit", date: commitDate.toISOString() },
    ]);

    const challenge = {
      id: 104,
      name: "Night Coder Challenge",
      description: "Commit entre 2h et 4h du matin.",
      duration: 1,
      reward_badge_id: 4,
      rewardBadge: {
        id: 4,
        name: "Night Coder",
        description: "Commit entre 2h et 4h du matin.",
        icon: "🌙",
        category: null,
        condition: "",
        created_at: new Date(),
      },
    };
    const userChallenge = { id: 204, user_id: "user1", challenge };

    (prisma.userChallenge.findMany as jest.Mock).mockResolvedValue([userChallenge]);
    (prisma.userChallenge.update as jest.Mock)
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "in_progress" })
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "completed", end_date: new Date() });

    (prisma.userBadge.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.badge.findUnique as jest.Mock).mockResolvedValue(challenge.rewardBadge);
    (prisma.userBadge.create as jest.Mock).mockResolvedValue({
      id: 303,
      user_id: "user1",
      badge_id: 4,
      unlocked_at: new Date(),
    });

    const result = await updateUserProgress("user1");
    expect(result.completedChallenges).toHaveLength(1);
    expect(result.awardedBadges).toHaveLength(1);
  });

  it("should complete a Weekend Warrior challenge if conditions are met", async () => {
    // Simuler getUserData pour une challenge Weekend Warrior (commit samedi et dimanche)
    const fakeStreakData = { current_streak: 1, longest_streak: 1 };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreakData);
    
    // Simuler un commit un samedi (jour 6)
    const saturdayDate = new Date();
    // Force au samedi (6)
    saturdayDate.setDate(saturdayDate.getDate() + (6 - saturdayDate.getDay()));
    
    // Simuler un commit un dimanche (jour 0)
    const sundayDate = new Date();
    // Force au dimanche (0)
    sundayDate.setDate(sundayDate.getDate() + (7 - sundayDate.getDay()));
    
    (prisma.contribution.findMany as jest.Mock).mockResolvedValue([
      { id: 11, type: "commit", date: saturdayDate.toISOString() },
      { id: 12, type: "commit", date: sundayDate.toISOString() },
    ]);

    const challenge = {
      id: 105,
      name: "Weekend Warrior Challenge",
      description: "Commit un samedi et dimanche.",
      duration: 2,
      reward_badge_id: 5,
      rewardBadge: {
        id: 5,
        name: "Weekend Warrior",
        description: "Commit un samedi et dimanche.",
        icon: "🏄‍♂️",
        category: null,
        condition: "",
        created_at: new Date(),
      },
    };
    const userChallenge = { id: 205, user_id: "user1", challenge };

    (prisma.userChallenge.findMany as jest.Mock).mockResolvedValue([userChallenge]);
    (prisma.userChallenge.update as jest.Mock)
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "in_progress" })
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "completed", end_date: new Date() });

    (prisma.userBadge.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.badge.findUnique as jest.Mock).mockResolvedValue(challenge.rewardBadge);
    (prisma.userBadge.create as jest.Mock).mockResolvedValue({
      id: 304,
      user_id: "user1",
      badge_id: 5,
      unlocked_at: new Date(),
    });

    const result = await updateUserProgress("user1");
    expect(result.completedChallenges).toHaveLength(1);
    expect(result.awardedBadges).toHaveLength(1);
  });

  it("should complete a One Day Madness challenge if conditions are met", async () => {
    // Simuler getUserData pour un challenge One Day Madness (100 commits en 24h)
    const fakeStreakData = { current_streak: 1, longest_streak: 1 };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreakData);
    
    // Créer 100 commits pour le même jour
    const sameDay = new Date();
    const commits = Array.from({ length: 100 }, (_, i) => ({
      id: 1000 + i,
      type: "commit",
      date: sameDay.toISOString(),
    }));
    
    (prisma.contribution.findMany as jest.Mock).mockResolvedValue(commits);

    const challenge = {
      id: 106,
      name: "One Day Madness Challenge",
      description: "Faites 100 commits en 24h.",
      duration: 1,
      reward_badge_id: 6,
      rewardBadge: {
        id: 6,
        name: "One Day Madness",
        description: "Faites 100 commits en 24h.",
        icon: "⚡",
        category: null,
        condition: "",
        created_at: new Date(),
      },
    };
    const userChallenge = { id: 206, user_id: "user1", challenge };

    (prisma.userChallenge.findMany as jest.Mock).mockResolvedValue([userChallenge]);
    (prisma.userChallenge.update as jest.Mock)
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "in_progress" })
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "completed", end_date: new Date() });

    (prisma.userBadge.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.badge.findUnique as jest.Mock).mockResolvedValue(challenge.rewardBadge);
    (prisma.userBadge.create as jest.Mock).mockResolvedValue({
      id: 305,
      user_id: "user1",
      badge_id: 6,
      unlocked_at: new Date(),
    });

    const result = await updateUserProgress("user1");
    expect(result.completedChallenges).toHaveLength(1);
    expect(result.awardedBadges).toHaveLength(1);
  });

  it("should complete a Forking Pro challenge if conditions are met", async () => {
    // Simuler getUserData pour un challenge Forking Pro (10 forks)
    const fakeStreakData = { current_streak: 1, longest_streak: 1 };
    (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreakData);
    
    // Créer 10 forks
    const forks = Array.from({ length: 10 }, (_, i) => ({
      id: 2000 + i,
      type: "fork",
      date: new Date().toISOString(),
    }));
    
    (prisma.contribution.findMany as jest.Mock).mockResolvedValue(forks);

    const challenge = {
      id: 107,
      name: "Forking Pro Challenge",
      description: "Faites 10 forks.",
      duration: 10,
      reward_badge_id: 7,
      rewardBadge: {
        id: 7,
        name: "Forking Pro",
        description: "Faites 10 forks.",
        icon: "🍴",
        category: null,
        condition: "",
        created_at: new Date(),
      },
    };
    const userChallenge = { id: 207, user_id: "user1", challenge };

    (prisma.userChallenge.findMany as jest.Mock).mockResolvedValue([userChallenge]);
    (prisma.userChallenge.update as jest.Mock)
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "in_progress" })
      .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "completed", end_date: new Date() });

    (prisma.userBadge.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.badge.findUnique as jest.Mock).mockResolvedValue(challenge.rewardBadge);
    (prisma.userBadge.create as jest.Mock).mockResolvedValue({
      id: 306,
      user_id: "user1",
      badge_id: 7,
      unlocked_at: new Date(),
    });

    const result = await updateUserProgress("user1");
    expect(result.completedChallenges).toHaveLength(1);
    expect(result.awardedBadges).toHaveLength(1);
  });
}); 