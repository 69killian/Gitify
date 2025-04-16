# Tests Gitify

Ce répertoire contient les tests pour le projet Gitify, notamment pour le système de progression (streaks, challenges et badges).

## Contenu

- [**progressService.test.ts**](progressService.test.ts) - Tests unitaires pour le service de progression
- [**COMPTE_RENDU.md**](COMPTE_RENDU.md) - Documentation détaillée des tests existants
- [**GUIDE_TECHNIQUE.md**](GUIDE_TECHNIQUE.md) - Guide technique pour l'extension des tests

## Démarrage rapide

Pour exécuter les tests :

```bash
npm test
```

Pour exécuter un fichier de test spécifique :

```bash
npm test -- tests/progressService.test.ts
```

## Objectifs des tests

Ces tests vérifient que :

1. **Streaks** - La gestion des séquences de contributions consécutives fonctionne correctement
2. **Challenges** - La progression des défis est calculée avec précision et les défis sont marqués comme terminés lorsque les conditions sont remplies
3. **Badges** - Les badges sont correctement attribués lors de la réalisation des conditions requises

## Couverture des tests

Les tests couvrent l'ensemble des fonctionnalités essentielles du système de progression. Chaque type de challenge est couvert par au moins un test dédié.

## Documentation

Pour plus de détails sur :
- L'implémentation actuelle et ses tests : consultez [COMPTE_RENDU.md](COMPTE_RENDU.md)
- L'ajout de nouveaux tests : consultez [GUIDE_TECHNIQUE.md](GUIDE_TECHNIQUE.md)

## Contribution

Si vous souhaitez contribuer au projet en ajoutant de nouveaux tests :

1. Assurez-vous de comprendre le système existant en lisant la documentation
2. Suivez les bonnes pratiques décrites dans le guide technique
3. Assurez-vous que tous les tests passent avant de soumettre votre contribution
4. Mettez à jour la documentation si nécessaire 