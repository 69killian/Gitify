/**
 * Script pour générer des données de test pour la table Contribution
 * 
 * Exécution : npx ts-node -r tsconfig-paths/register scripts/seed-contributions.ts
 */

import prisma from '../lib/prisma';

async function main() {
  // Récupérer un utilisateur existant
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.error('Aucun utilisateur n\'a été trouvé. Créez d\'abord un compte via l\'authentification GitHub.');
    process.exit(1);
  }

  console.log(`Génération de contributions pour l'utilisateur: ${user.name || user.username} (${user.id})`);

  // Définir des repos de test
  const repositories = [
    'gitify',
    'open-source-together',
    'next-app',
    'prisma-demo',
    'typescript-utils'
  ];

  // Définir les types de contributions
  const contributionTypes = ['commit', 'pr', 'merge'];

  // Générer des messages génériques
  const getCommitMessage = () => {
    const prefixes = ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'];
    const components = ['auth', 'ui', 'api', 'database', 'components', 'utils', 'tests'];
    const actions = [
      'add new feature',
      'fix bug',
      'improve performance',
      'update documentation',
      'refactor code',
      'remove deprecated code',
      'implement user feedback'
    ];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const component = components[Math.floor(Math.random() * components.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return `${prefix}(${component}): ${action}`;
  };

  const getPRMessage = () => {
    const actions = [
      'Add',
      'Fix',
      'Implement',
      'Update',
      'Refactor',
      'Improve',
      'Optimize'
    ];
    
    const features = [
      'user authentication',
      'dashboard layout',
      'contribution tracking',
      'GitHub API integration',
      'leaderboard',
      'badges system',
      'dark mode',
      'mobile responsiveness'
    ];
    
    const action = actions[Math.floor(Math.random() * actions.length)];
    const feature = features[Math.floor(Math.random() * features.length)];
    
    return `${action} ${feature}`;
  };

  // Générer des dates pour les derniers 90 jours
  const generateRandomDate = () => {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 90);
    now.setDate(now.getDate() - daysAgo);
    return now;
  };

  // Créer un tableau pour les contributions
  const contributions = [];

  // Générer des commits (plus nombreux)
  for (let i = 0; i < 50; i++) {
    const repo = repositories[Math.floor(Math.random() * repositories.length)];
    contributions.push({
      user_id: user.id,
      type: 'commit',
      repository: repo,
      message: getCommitMessage(),
      date: generateRandomDate()
    });
  }

  // Générer des pull requests
  for (let i = 0; i < 15; i++) {
    const repo = repositories[Math.floor(Math.random() * repositories.length)];
    contributions.push({
      user_id: user.id,
      type: 'pr',
      repository: repo,
      message: getPRMessage(),
      date: generateRandomDate()
    });
  }

  // Générer des merges (moins nombreux)
  for (let i = 0; i < 10; i++) {
    const repo = repositories[Math.floor(Math.random() * repositories.length)];
    const prNumber = Math.floor(Math.random() * 100) + 1;
    contributions.push({
      user_id: user.id,
      type: 'merge',
      repository: repo,
      message: `Merged PR #${prNumber}: ${getPRMessage()}`,
      date: generateRandomDate()
    });
  }

  // Insérer les contributions dans la base de données
  const result = await prisma.contribution.createMany({
    data: contributions,
    skipDuplicates: true,
  });

  console.log(`${result.count} contributions ont été insérées avec succès !`);
  
  // Afficher quelques statistiques
  const stats = await Promise.all([
    prisma.contribution.count({ where: { user_id: user.id, type: 'commit' } }),
    prisma.contribution.count({ where: { user_id: user.id, type: 'pr' } }),
    prisma.contribution.count({ where: { user_id: user.id, type: 'merge' } }),
  ]);

  console.log(`Statistiques de l'utilisateur ${user.name || user.username}:`);
  console.log(`- Commits: ${stats[0]}`);
  console.log(`- Pull Requests: ${stats[1]}`);
  console.log(`- Merges: ${stats[2]}`);
  console.log(`- Total: ${stats[0] + stats[1] + stats[2]}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 