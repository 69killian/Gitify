/**
 * Script pour générer des badges de test et les attribuer à l'utilisateur
 * 
 * Exécution : npx ts-node -r tsconfig-paths/register scripts/seed-badges.ts
 */

import prisma from '../lib/prisma';

async function main() {
  // Récupérer un utilisateur existant
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.error('Aucun utilisateur n\'a été trouvé. Créez d\'abord un compte via l\'authentification GitHub.');
    process.exit(1);
  }

  console.log(`Génération de badges pour l'utilisateur: ${user.name || user.username} (${user.id})`);

  // Définir les badges à créer
  const badgesToCreate = [
    // Badges de Streak
    { 
      name: "Streak Newbie", 
      description: "Premier streak atteint", 
      icon: "🔥", 
      category: "🔥 Streaks", 
      condition: "3 jours de streak" 
    },
    { 
      name: "Streak Enthusiast", 
      description: "Tu commences à être sérieux", 
      icon: "🔥🔥", 
      category: "🔥 Streaks", 
      condition: "7 jours de streak" 
    },
    { 
      name: "Streak Warrior", 
      description: "La régularité paie !", 
      icon: "⚔️🔥", 
      category: "🔥 Streaks", 
      condition: "15 jours de streak" 
    },
    { 
      name: "Streak Master", 
      description: "Tu es un vrai grinder", 
      icon: "🏅🔥", 
      category: "🔥 Streaks", 
      condition: "30 jours de streak" 
    },
    { 
      name: "Streak God", 
      description: "Plus déterminé que jamais", 
      icon: "🏆🔥", 
      category: "🔥 Streaks", 
      condition: "100 jours de streak" 
    },
    
    // Badges de Pull Request
    { 
      name: "PR Rookie", 
      description: "Première pull request soumise", 
      icon: "🔄", 
      category: "📝 Pull Requests", 
      condition: "1 pull request" 
    },
    { 
      name: "PR Creator", 
      description: "Tu prends de l'assurance", 
      icon: "🔄🔄", 
      category: "📝 Pull Requests", 
      condition: "5 pull requests" 
    },
    { 
      name: "PR Expert", 
      description: "Un vrai professionnel", 
      icon: "🏆🔄", 
      category: "📝 Pull Requests", 
      condition: "20 pull requests" 
    },
    
    // Badges de Commits
    { 
      name: "First Commit", 
      description: "Premier pas dans le monde du code", 
      icon: "📝", 
      category: "💻 Commits", 
      condition: "1 commit" 
    },
    { 
      name: "Code Contributor", 
      description: "Tu participes activement", 
      icon: "📝📝", 
      category: "💻 Commits", 
      condition: "10 commits" 
    },
    { 
      name: "Commit Machine", 
      description: "Tes contributions sont impressionnantes", 
      icon: "🤖📝", 
      category: "💻 Commits", 
      condition: "50 commits" 
    },
    { 
      name: "Code Legend", 
      description: "Tu es une légende vivante", 
      icon: "👑📝", 
      category: "💻 Commits", 
      condition: "100 commits" 
    },
    
    // Badges de Repository
    { 
      name: "Repository Creator", 
      description: "Tu as créé ton premier repo", 
      icon: "📁", 
      category: "📂 Repositories", 
      condition: "1 repository" 
    },
    { 
      name: "Project Manager", 
      description: "Tu gères plusieurs projets", 
      icon: "📁📁", 
      category: "📂 Repositories", 
      condition: "5 repositories" 
    },
    
    // Badges Spéciaux
    { 
      name: "Night Owl", 
      description: "Tu codes tard dans la nuit", 
      icon: "🦉", 
      category: "✨ Spécial", 
      condition: "Committer après minuit" 
    },
    { 
      name: "Weekend Warrior", 
      description: "Tu codes même le weekend", 
      icon: "🏝️", 
      category: "✨ Spécial", 
      condition: "Committer le weekend" 
    },
    { 
      name: "Multilingual", 
      description: "Tu maîtrises plusieurs langages", 
      icon: "🌐", 
      category: "✨ Spécial", 
      condition: "Coder dans 3+ langages" 
    },
  ];

  console.log(`Création de ${badgesToCreate.length} badges...`);

  // Insérer les badges
  const badges = [];
  for (const badgeData of badgesToCreate) {
    try {
      // Vérifier si le badge existe déjà
      const existingBadge = await prisma.badge.findFirst({
        where: { name: badgeData.name }
      });

      if (existingBadge) {
        console.log(`Le badge "${badgeData.name}" existe déjà.`);
        badges.push(existingBadge);
      } else {
        // Créer le badge
        const badge = await prisma.badge.create({
          data: {
            name: badgeData.name,
            description: badgeData.description,
            icon: badgeData.icon,
            category: badgeData.category,
            condition: badgeData.condition,
          }
        });
        console.log(`Badge créé: ${badge.name}`);
        badges.push(badge);
      }
    } catch (error) {
      console.error(`Erreur lors de la création du badge "${badgeData.name}":`, error);
    }
  }

  console.log(`${badges.length} badges sont disponibles.`);

  // Attribuer certains badges à l'utilisateur (simulation de badges débloqués)
  // Par défaut, débloquons environ 5 badges pour l'utilisateur
  const badgesToUnlock = badges.slice(0, 5);

  console.log(`Attribution de ${badgesToUnlock.length} badges à l'utilisateur...`);

  for (const badge of badgesToUnlock) {
    try {
      const existingUserBadge = await prisma.userBadge.findFirst({
        where: {
          user_id: user.id,
          badge_id: badge.id
        }
      });

      if (existingUserBadge) {
        console.log(`L'utilisateur possède déjà le badge "${badge.name}".`);
      } else {
        // Attribuer le badge à l'utilisateur
        const userBadge = await prisma.userBadge.create({
          data: {
            user_id: user.id,
            badge_id: badge.id,
            unlocked_at: new Date()
          }
        });
        console.log(`Badge "${badge.name}" attribué à l'utilisateur!`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'attribution du badge "${badge.name}":`, error);
    }
  }

  // Afficher un résumé
  const userBadges = await prisma.userBadge.findMany({
    where: { user_id: user.id },
    include: { badge: true }
  });

  console.log(`\nRésumé pour l'utilisateur ${user.name || user.username}:`);
  console.log(`- Total de badges débloqués: ${userBadges.length}`);
  
  const badgesByCategory = userBadges.reduce((acc, userBadge) => {
    const category = userBadge.badge.category || "Non catégorisé";
    if (!acc[category]) acc[category] = [];
    acc[category].push(userBadge.badge);
    return acc;
  }, {} as Record<string, any[]>);

  console.log("- Badges par catégorie:");
  Object.entries(badgesByCategory).forEach(([category, badges]) => {
    console.log(`  * ${category}: ${badges.length} badges`);
    badges.forEach(badge => {
      console.log(`    - ${badge.name} (${badge.icon})`);
    });
  });
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