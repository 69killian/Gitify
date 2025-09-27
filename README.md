# Gitify – Gamifions l'open source
![Screen](screen)

Gitify est une application SaaS open source conçue pour transformer votre activité GitHub en une expérience ludique et motivante. Elle vous permet de suivre votre progression, de collectionner des badges et de relever des défis pour gamifier vos contributions open source.

DEMO : warmhearted-imagine-949567.framer.app/

## Fonctionnalités

- **Authentification GitHub via OAuth**  
  Connexion simple avec GitHub. Synchronisation automatique de vos données publiques (profil, contributions, repositories) via **NextAuth.js** et **TypeScript**.

- **Tableau de bord utilisateur dynamique**  
  Calendrier interactif des contributions, vue d'ensemble et historique des streaks, développés avec **React**, **Tailwind CSS** et **TypeScript**.

- **Système de badges**  
  Collection et affichage des badges basés sur vos contributions, streaks et participation aux défis. Affichage, progression et filtrage par catégorie codés en **TypeScript** et stylés avec **Tailwind CSS**.

- **Défis et challenges**  
  Objectifs variés et conditions de complétion pour améliorer votre performance sur GitHub, réalisés en **TypeScript**.

- **Classement (Leaderboard)**  
  Comparez vos performances avec celles d'autres contributeurs. Intégration via **Prisma** (avec **PostgreSQL**) et **TypeScript**.

- **Gestion des intégrations**  
  Gestion conditionnelle des intégrations (ex. Discord, X) avec affichage "Bientôt disponible", développée en **React** et **TypeScript**.

- **Composants UI avancés**  
  Utilisation de **Radix UI** pour les composants Dialog et Dropdown Menu, implémentés avec **React** et **TypeScript**.

- **Tests unitaires**  
  Assurance de la robustesse du calcul des streaks et de la progression des défis via **Jest** et **TypeScript**.

- **Outils utilitaires**  
  Fonction `cn` (dans `lib/utils.ts`) pour la gestion des classes CSS, développée en **TypeScript** avec l'aide de **clsx** et **tailwind-merge**.

- **Déploiement continu**  
  Déploiement sur **Vercel** pour des performances optimisées et une intégration native avec **Next.js**.

## Stack Technique

### Frontend
- **Next.js** – Framework React moderne pour le rendu hybride (SSR, SSG, ISR)
- **React** – Bibliothèque pour construire l'interface utilisateur
- **TypeScript** – Typage statique pour plus de fiabilité et maintenabilité
- **Tailwind CSS** – Framework utilitaire pour le styling
- **Radix UI** – Composants UI modernes pour Dialog et Dropdown Menu

### Backend & Base de données
- **Prisma ORM** – Interface de gestion de la base de données avec des requêtes SQL optimisées
- **PostgreSQL** – Base de données relationnelle robuste (via **Supabase**)

### Authentification
- **NextAuth.js** – Authentification OAuth intégrée avec GitHub

### Tests
- **Jest** – Suite de tests unitaires pour assurer la robustesse des fonctionnalités

### Déploiement
- **Vercel** – Plateforme de déploiement continu optimisée pour les applications Next.js

## Installation

1. **Clonez le dépôt**
   ```bash
   git clone <repository-url>
   cd gitify
   ```

2. **Installez les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**  
   Créez un fichier `.env.local` à la racine du projet et configurez-y vos variables (clés API, secrets GitHub, etc.).

4. **Migrer la base de données** (si applicable)
   ```bash
   npx prisma migrate dev
   ```

## Lancer le projet en local

Exécutez la commande suivante :
```bash
npm run dev
```
Le projet sera accessible sur [http://localhost:3000](http://localhost:3000).

## Tests Unitaires

Pour exécuter les tests, lancez :
```bash
npm run test
```

## Déploiement sur Vercel

Gitify est configuré pour être déployé sur **Vercel**. Pour déployer le projet :
1. Connectez votre dépôt à Vercel.
2. Vercel détectera automatiquement la configuration **Next.js**.
3. Configurez les variables d'environnement nécessaires depuis le dashboard Vercel.
4. Un déploiement continu sera déclenché à chaque push sur le dépôt.

## Structure du projet

La structure du dépôt est organisée de la manière suivante :
```
├── app
│   ├── api
│   │   └── auth
│   │       ├── options.ts
│   │       └── route.ts
│   ├── badges
│   │   ├── Components
│   │   │   └── Content.tsx
│   │   └── page.tsx
│   ├── classement
│   │   ├── Components
│   │   │   ├── Content.tsx
│   │   │   └── Leaderboard.tsx
│   │   └── page.tsx
│   ├── ...
└── components
    └── ui
        ├── dialog.tsx
        ├── dropdown-menu.tsx
        └── ...
```

## Contributions

Les contributions sont les bienvenues ! Pour contribuer :
1. Forkez le dépôt.
2. Créez une branche à partir de `main`.
3. Apportez vos modifications et envoyez une pull request détaillant bien les changements.
4. Assurez-vous que les tests passent avant de soumettre votre PR.

## Documentation & Support

Pour toute question, problème ou suggestion, consultez la documentation des **API** ou ouvrez une issue sur GitHub.

## License

Gitify est un projet open source sous licence [MIT License](LICENSE).

---

Gitify transforme vos contributions GitHub en une aventure ludique et motivante. Rejoignez la communauté et commencez à gamifier votre parcours open source dès aujourd'hui !

V2 coming soon
