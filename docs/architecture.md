# Architecture

CyberSentinel 0.5 utilise React, TypeScript et Vite.

```text
src/
├── resources/        Annuaire local de services externes
├── tools/            Outils et vues fonctionnelles
├── App.tsx           Navigation principale
├── App.css           Styles des composants
└── main.tsx          Point d’entrée React
```

## Principes

- Les analyses de mots de passe, de liens et de fichiers s’exécutent localement.
- L’annuaire est livré avec l’application et ne nécessite aucune API.
- Les services externes ne sont ouverts qu’après une action explicite de l’utilisateur.
- Aucune clé secrète ne doit être placée dans le code client.

## Évolution prévue

Une future couche Tauri permettra de distribuer CyberSentinel comme application de bureau Windows et Linux avec des permissions minimales. Cette couche n’est pas encore intégrée.
