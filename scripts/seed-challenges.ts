import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du script de seed pour les challenges et badges...');

  try {
    // Créer les badges pour les différentes catégories
    console.log('Création des badges...');
    
    // 1. Badges de streak
    const streakBadges = await Promise.all([
      prisma.badge.create({
        data: {
          name: 'Streak Newbie',
          description: 'Premier streak atteint',
          icon: '🔥',
          category: '🔥 Streaks',
          condition: '3 jours de streak consécutifs'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Streak Enthusiast',
          description: 'Tu commences à être sérieux',
          icon: '🔥🔥',
          category: '🔥 Streaks',
          condition: '7 jours de streak consécutifs'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Streak Warrior',
          description: 'La régularité paie !',
          icon: '⚔️🔥',
          category: '🔥 Streaks',
          condition: '15 jours de streak consécutifs'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Streak Master',
          description: 'Tu es un vrai grinder',
          icon: '🏅🔥',
          category: '🔥 Streaks',
          condition: '30 jours de streak consécutifs'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Streak God',
          description: 'Plus déterminé que jamais',
          icon: '🏆🔥',
          category: '🔥 Streaks',
          condition: '100 jours de streak consécutifs'
        }
      })
    ]);

    // 2. Badges de contribution
    const contributionBadges = await Promise.all([
      prisma.badge.create({
        data: {
          name: 'First Commit',
          description: 'Premier pas dans l\'open source',
          icon: '🚀',
          category: '📝 Contributions',
          condition: 'Faire son premier commit'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Contributor',
          description: 'Contributeur régulier',
          icon: '📝',
          category: '📝 Contributions',
          condition: 'Faire 10 commits'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Code Machine',
          description: 'Machine à code en action',
          icon: '⚙️',
          category: '📝 Contributions',
          condition: 'Faire 100 commits'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Code Addict',
          description: 'Addiction au code',
          icon: '💻',
          category: '📝 Contributions',
          condition: 'Faire 500 commits'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Code Legend',
          description: 'Légende du code',
          icon: '👑',
          category: '📝 Contributions',
          condition: 'Faire 1000 commits'
        }
      })
    ]);

    // 3. Badges de Pull Request
    const prBadges = await Promise.all([
      prisma.badge.create({
        data: {
          name: 'First PR',
          description: 'Première Pull Request',
          icon: '🔄',
          category: '🔄 Pull Requests',
          condition: 'Faire sa première pull request'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Merge Master',
          description: 'Maître des fusions',
          icon: '🔀',
          category: '🔄 Pull Requests',
          condition: 'Fusionner 5 pull requests'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'PR Hero',
          description: 'Héros des pull requests',
          icon: '🦸',
          category: '🔄 Pull Requests',
          condition: 'Fusionner 10 pull requests'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Open Source Champion',
          description: 'Champion de l\'open source',
          icon: '🏆',
          category: '🔄 Pull Requests',
          condition: 'Fusionner 20 pull requests'
        }
      })
    ]);

    // 4. Badges Open Source
    const osBadges = await Promise.all([
      prisma.badge.create({
        data: {
          name: 'Public Repo',
          description: 'Premier repo public',
          icon: '📂',
          category: '📂 Open Source',
          condition: 'Créer son premier repo public'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Open Source Addict',
          description: 'Accro à l\'open source',
          icon: '📚',
          category: '📂 Open Source',
          condition: 'Créer 3 repos publics'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'OSS Rockstar',
          description: 'Rockstar de l\'open source',
          icon: '🎸',
          category: '📂 Open Source',
          condition: 'Créer 10 repos publics'
        }
      })
    ]);

    // 5. Badges secrets
    const secretBadges = await Promise.all([
      prisma.badge.create({
        data: {
          name: 'Night Coder',
          description: 'Codeur nocturne',
          icon: '🌙',
          category: '🔒 Badges Secrets',
          condition: 'Commit entre 2h et 4h du matin'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Weekend Warrior',
          description: 'Guerrier du weekend',
          icon: '🏖️',
          category: '🔒 Badges Secrets',
          condition: 'Commit un samedi et dimanche'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'One Day Madness',
          description: 'Folie d\'un jour',
          icon: '🤯',
          category: '🔒 Badges Secrets',
          condition: 'Faire 100 commits en 24h'
        }
      }),
      prisma.badge.create({
        data: {
          name: 'Forking Pro',
          description: 'Pro du fork',
          icon: '🍴',
          category: '🔒 Badges Secrets',
          condition: 'Faire 10 forks'
        }
      })
    ]);

    console.log(`✅ ${streakBadges.length + contributionBadges.length + prBadges.length + osBadges.length + secretBadges.length} badges créés avec succès.`);

    // Créer les challenges associés aux badges
    console.log('Création des challenges...');

    // 1. Challenges de streak
    const streakChallenges = await Promise.all([
      prisma.challenge.create({
        data: {
          name: 'Streak Newbie Challenge',
          description: 'Atteignez un streak de 3 jours.',
          difficulty: 'Facile',
          duration: 3,
          reward_badge_id: streakBadges[0].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Streak Enthusiast Challenge',
          description: 'Atteignez un streak de 7 jours.',
          difficulty: 'Moyenne',
          duration: 7,
          reward_badge_id: streakBadges[1].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Streak Warrior Challenge',
          description: 'Atteignez un streak de 15 jours.',
          difficulty: 'Difficile',
          duration: 15,
          reward_badge_id: streakBadges[2].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Streak Master Challenge',
          description: 'Atteignez un streak de 30 jours.',
          difficulty: 'Très Difficile',
          duration: 30,
          reward_badge_id: streakBadges[3].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Streak God Challenge',
          description: 'Atteignez un streak de 100 jours.',
          difficulty: 'Extrême',
          duration: 100,
          reward_badge_id: streakBadges[4].id
        }
      })
    ]);

    // 2. Challenges de contribution
    const contributionChallenges = await Promise.all([
      prisma.challenge.create({
        data: {
          name: 'First Commit Challenge',
          description: 'Faites votre premier commit.',
          difficulty: 'Facile',
          duration: 1,
          reward_badge_id: contributionBadges[0].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Contributor Challenge',
          description: 'Faites 10 commits.',
          difficulty: 'Moyenne',
          duration: 10,
          reward_badge_id: contributionBadges[1].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Code Machine Challenge',
          description: 'Faites 100 commits.',
          difficulty: 'Difficile',
          duration: 100,
          reward_badge_id: contributionBadges[2].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Code Addict Challenge',
          description: 'Faites 500 commits.',
          difficulty: 'Très Difficile',
          duration: 500,
          reward_badge_id: contributionBadges[3].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Code Legend Challenge',
          description: 'Faites 1000 commits.',
          difficulty: 'Extrême',
          duration: 1000,
          reward_badge_id: contributionBadges[4].id
        }
      })
    ]);

    // 3. Challenges de Pull Request
    const prChallenges = await Promise.all([
      prisma.challenge.create({
        data: {
          name: 'First PR Challenge',
          description: 'Faites votre première pull request.',
          difficulty: 'Facile',
          duration: 1,
          reward_badge_id: prBadges[0].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Merge Master Challenge',
          description: 'Fusionnez 5 PRs.',
          difficulty: 'Moyenne',
          duration: 5,
          reward_badge_id: prBadges[1].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'PR Hero Challenge',
          description: 'Fusionnez 10 PRs.',
          difficulty: 'Difficile',
          duration: 10,
          reward_badge_id: prBadges[2].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Open Source Champion Challenge',
          description: 'Fusionnez 20 PRs.',
          difficulty: 'Très Difficile',
          duration: 20,
          reward_badge_id: prBadges[3].id
        }
      })
    ]);

    // 4. Challenges Open Source
    const osChallenges = await Promise.all([
      prisma.challenge.create({
        data: {
          name: 'Public Repo Challenge',
          description: 'Créez votre premier repo public.',
          difficulty: 'Facile',
          duration: 1,
          reward_badge_id: osBadges[0].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Open Source Addict Challenge',
          description: 'Créez 3 repos publics.',
          difficulty: 'Moyenne',
          duration: 3,
          reward_badge_id: osBadges[1].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'OSS Rockstar Challenge',
          description: 'Créez 10 repos publics.',
          difficulty: 'Difficile',
          duration: 10,
          reward_badge_id: osBadges[2].id
        }
      })
    ]);

    // 5. Challenges secrets
    const secretChallenges = await Promise.all([
      prisma.challenge.create({
        data: {
          name: 'Night Coder Challenge',
          description: 'Commit entre 2h et 4h du matin.',
          difficulty: 'Facile',
          duration: 1,
          reward_badge_id: secretBadges[0].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Weekend Warrior Challenge',
          description: 'Commit un samedi et dimanche.',
          difficulty: 'Moyenne',
          duration: 2,
          reward_badge_id: secretBadges[1].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'One Day Madness Challenge',
          description: 'Faites 100 commits en 24h.',
          difficulty: 'Extrême',
          duration: 1,
          reward_badge_id: secretBadges[2].id
        }
      }),
      prisma.challenge.create({
        data: {
          name: 'Forking Pro Challenge',
          description: 'Faites 10 forks.',
          difficulty: 'Difficile',
          duration: 10,
          reward_badge_id: secretBadges[3].id
        }
      })
    ]);

    console.log(`✅ ${streakChallenges.length + contributionChallenges.length + prChallenges.length + osChallenges.length + secretChallenges.length} challenges créés avec succès.`);

    // Créer des contributions de test pour le premier utilisateur
    const user = await prisma.user.findFirst({
      orderBy: { created_at: 'asc' }
    });

    if (user) {
      console.log(`Création de contributions de test pour l'utilisateur ${user.username}...`);
      
      // Créer quelques commits de test
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

      await Promise.all([
        // Commits réguliers
        prisma.contribution.create({
          data: {
            user_id: user.id,
            type: 'commit',
            repository: 'example/repo',
            message: 'Initial commit',
            date: twoDaysAgo
          }
        }),
        prisma.contribution.create({
          data: {
            user_id: user.id,
            type: 'commit',
            repository: 'example/repo',
            message: 'Fix typo',
            date: yesterday
          }
        }),
        prisma.contribution.create({
          data: {
            user_id: user.id,
            type: 'commit',
            repository: 'example/repo',
            message: 'Add new feature',
            date: today
          }
        }),
        
        // Commit nocturne pour tester Night Coder
        prisma.contribution.create({
          data: {
            user_id: user.id,
            type: 'commit',
            repository: 'example/repo',
            message: 'Late night fix',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 3, 15, 0) // 3h15 du matin
          }
        }),
        
        // Commits du weekend
        prisma.contribution.create({
          data: {
            user_id: user.id,
            type: 'commit',
            repository: 'example/repo',
            message: 'Weekend work',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() % 6 + 1)) // Samedi dernier
          }
        }),
        prisma.contribution.create({
          data: {
            user_id: user.id,
            type: 'commit',
            repository: 'example/repo',
            message: 'Sunday improvements',
            date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() % 7)) // Dimanche dernier
          }
        }),
        
        // Pull requests
        prisma.contribution.create({
          data: {
            user_id: user.id,
            type: 'pull_request',
            repository: 'example/repo',
            message: 'Add new feature',
            date: yesterday
          }
        }),
        
        // Création de repo
        prisma.contribution.create({
          data: {
            user_id: user.id,
            type: 'repo_creation',
            repository: 'user/new-project',
            message: 'Created repository',
            date: today
          }
        })
      ]);

      // Créer un streak actif
      await prisma.streak.create({
        data: {
          user_id: user.id,
          start_date: twoDaysAgo,
          current_streak: 3,
          longest_streak: 3,
          is_active: true
        }
      });

      // Attribuer quelques badges et challenges à l'utilisateur
      await prisma.userBadge.create({
        data: {
          user_id: user.id,
          badge_id: streakBadges[0].id, // Streak Newbie
          unlocked_at: today
        }
      });

      await prisma.userBadge.create({
        data: {
          user_id: user.id,
          badge_id: contributionBadges[0].id, // First Commit
          unlocked_at: today
        }
      });

      // Démarrer quelques challenges
      await prisma.userChallenge.create({
        data: {
          user_id: user.id,
          challenge_id: streakChallenges[1].id, // Streak Enthusiast Challenge
          status: 'in_progress',
          progress: 43, // 3 jours sur 7 = ~43%
        }
      });

      await prisma.userChallenge.create({
        data: {
          user_id: user.id,
          challenge_id: contributionChallenges[1].id, // Contributor Challenge
          status: 'in_progress',
          progress: 50, // 5 commits sur 10 = 50%
        }
      });

      // Compléter un challenge
      await prisma.userChallenge.create({
        data: {
          user_id: user.id,
          challenge_id: streakChallenges[0].id, // Streak Newbie Challenge
          status: 'completed',
          progress: 100,
          start_date: twoDaysAgo,
          end_date: today
        }
      });

      console.log('✅ Données de test créées avec succès.');
    } else {
      console.log('⚠️ Aucun utilisateur trouvé pour créer des données de test.');
    }

    console.log('🎉 Seed terminé avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors du seed :', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  }); 