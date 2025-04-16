# Guide technique des tests Gitify

Ce document est destiné aux développeurs qui souhaitent étendre ou modifier les tests du système de progression de Gitify. Il explique l'architecture technique des tests, comment ils fonctionnent, et comment en ajouter de nouveaux.

## Environnement de test

### Prérequis
- Node.js et npm installés
- Dépendances de développement : Jest, ts-jest, @types/jest

### Configuration
La configuration Jest se trouve dans le fichier `jest.config.js` à la racine du projet. Cette configuration est générée avec `ts-jest` pour permettre l'exécution de tests écrits en TypeScript.

### Exécution des tests
```bash
npm test
```

## Structure des tests

### Organisation des fichiers
- `tests/progressService.test.ts` : Tests du service de progression (streaks, challenges, badges)
- `tests/COMPTE_RENDU.md` : Documentation détaillée des tests existants
- `tests/GUIDE_TECHNIQUE.md` : Ce guide technique

## Principe de mock

Les tests reposent sur le principe de "mocking" pour simuler les interactions avec la base de données. Cela permet de tester le comportement logique sans avoir besoin d'une base de données réelle.

```typescript
jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    // Modèles mockés avec leurs méthodes
    streak: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    // ...
  },
}));
```

### Comment configurer un mock pour un test spécifique

```typescript
// Exemple : Simuler la récupération d'un streak
beforeEach(() => {
  jest.clearAllMocks(); // Nettoyer les mocks entre les tests
});

it("should do something", async () => {
  // Configurer le mock pour retourner une valeur spécifique
  (prisma.streak.findFirst as jest.Mock).mockResolvedValue({
    id: 1,
    user_id: "user123",
    current_streak: 5,
    // ...autres propriétés
  });
  
  // Le reste du test...
});
```

## Ajouter un nouveau test

### 1. Pour un nouveau scénario d'une fonction existante

```typescript
// Dans tests/progressService.test.ts
it("should handle a new scenario", async () => {
  // 1. Configurer les mocks pour simuler l'état initial
  (prisma.streak.findFirst as jest.Mock).mockResolvedValue(/* valeur simulée */);
  
  // 2. Si nécessaire, configurer les mocks pour simuler les résultats d'opérations
  (prisma.streak.update as jest.Mock).mockResolvedValue(/* résultat simulé */);
  
  // 3. Appeler la fonction à tester
  const result = await updateUserStreak("user123");
  
  // 4. Vérifier que le résultat est conforme aux attentes
  expect(result).toEqual(/* résultat attendu */);
  
  // 5. Optionnel : vérifier que les bonnes méthodes ont été appelées
  expect(prisma.streak.update).toHaveBeenCalledWith(/* paramètres attendus */);
});
```

### 2. Pour un nouveau type de challenge

Si vous ajoutez un nouveau type de challenge dans le système, vous devrez ajouter un test correspondant dans la section `updateUserProgress`. Exemple pour un challenge hypothétique "Issue Solver" :

```typescript
it("should complete an Issue Solver challenge if conditions are met", async () => {
  // 1. Simuler l'état du streak (généralement nécessaire pour tous les challenges)
  const fakeStreakData = { current_streak: 1, longest_streak: 1 };
  (prisma.streak.findFirst as jest.Mock).mockResolvedValue(fakeStreakData);
  
  // 2. Simuler les contributions pertinentes pour ce type de challenge
  // Par exemple, simuler 20 issues résolues
  const issues = Array.from({ length: 20 }, (_, i) => ({
    id: 3000 + i,
    type: "issue_solved",
    date: new Date().toISOString(),
  }));
  (prisma.contribution.findMany as jest.Mock).mockResolvedValue(issues);

  // 3. Définir un challenge de test
  const challenge = {
    id: 108,
    name: "Issue Solver Challenge",
    description: "Résolvez 20 issues.",
    duration: 20,
    reward_badge_id: 8,
    rewardBadge: {
      id: 8,
      name: "Issue Solver",
      description: "Résolvez 20 issues.",
      icon: "🔧",
      category: null,
      condition: "",
      created_at: new Date(),
    },
  };
  const userChallenge = { id: 208, user_id: "user1", challenge };

  // 4. Simuler la récupération des challenges de l'utilisateur
  (prisma.userChallenge.findMany as jest.Mock).mockResolvedValue([userChallenge]);
  
  // 5. Simuler les mises à jour de progress et completion
  (prisma.userChallenge.update as jest.Mock)
    .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "in_progress" })
    .mockResolvedValueOnce({ ...userChallenge, progress: 100, status: "completed", end_date: new Date() });

  // 6. Simuler la vérification et l'attribution du badge
  (prisma.userBadge.findFirst as jest.Mock).mockResolvedValue(null);
  (prisma.badge.findUnique as jest.Mock).mockResolvedValue(challenge.rewardBadge);
  (prisma.userBadge.create as jest.Mock).mockResolvedValue({
    id: 307,
    user_id: "user1",
    badge_id: 8,
    unlocked_at: new Date(),
  });

  // 7. Exécuter la fonction et vérifier le résultat
  const result = await updateUserProgress("user1");
  expect(result.completedChallenges).toHaveLength(1);
  expect(result.awardedBadges).toHaveLength(1);
});
```

### 3. Pour tester une nouvelle fonction

Si vous ajoutez une nouvelle fonction au système de progression, créez une nouvelle section de tests :

```typescript
describe("yourNewFunction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should do what it's supposed to do", async () => {
    // Configuration des mocks...
    
    // Appel de la fonction...
    const result = await yourNewFunction(/* params */);
    
    // Assertions...
    expect(result).toBe(/* expected value */);
  });
  
  // Autres tests pour différents scénarios...
});
```

## Bonnes pratiques

### 1. Isolation des tests
Chaque test doit être indépendant des autres. Utilisez `beforeEach(() => { jest.clearAllMocks(); })` pour réinitialiser les mocks entre les tests.

### 2. Nommage explicite
Utilisez des noms descriptifs pour vos tests avec le format "should [expected behavior] when [condition]".

### 3. Structure AAA
Suivez le pattern Arrange-Act-Assert :
- **Arrange** : Préparez l'environnement et les données de test
- **Act** : Exécutez la fonction à tester
- **Assert** : Vérifiez que le résultat correspond aux attentes

### 4. Simulez uniquement ce qui est nécessaire
Ne mockez que les fonctions qui doivent être simulées pour le test en question. Évitez de surcharger les tests avec des mocks inutiles.

### 5. Tests de cas limites
Pensez à tester les cas limites et les scénarios d'erreur, pas seulement les cas nominaux.

## Dépannage

### Erreurs courantes

#### 1. "Cannot find module"
Vérifiez les chemins d'importation et assurez-vous que tous les modules nécessaires sont installés.

#### 2. "TypeError: Cannot read property 'X' of undefined"
Généralement, cela signifie qu'un mock n'a pas été correctement configuré ou que la fonction teste des propriétés sur un objet null/undefined.

#### 3. Tests qui échouent de manière aléatoire
Vérifiez si vos tests ont des dépendances sur des valeurs non déterministes comme `Date.now()`. Utilisez des dates fixes pour les tests.

## Extension du système de test

### Ajouter un nouveau type de mock

Si vous ajoutez une nouvelle entité à la base de données, vous devrez étendre le mock :

```typescript
jest.mock("../lib/prisma", () => ({
  __esModule: true,
  default: {
    // Modèles existants...
    
    // Nouveau modèle
    yourNewModel: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      // ... autres méthodes
    },
  },
}));
```

### Tester les hooks React

Pour les composants qui utilisent les données du système de progression, vous pourriez avoir besoin de tester des hooks React. Consultez la documentation de Jest et React Testing Library pour plus d'informations sur ce sujet.

---

Ce guide devrait vous permettre d'étendre et de maintenir les tests du système de progression de Gitify. Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter l'équipe de développement. 