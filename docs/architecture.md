# Architecture

CyberSentinel 0.6 utilise React, TypeScript et Vite pour l’interface, avec Tauri 2 pour l’application de bureau.

```text
src/
├── resources/        Annuaire local de services externes
├── tools/            Outils et vues fonctionnelles
├── App.tsx           Navigation principale
├── App.css           Styles des composants
└── main.tsx          Point d’entrée React
src-tauri/
├── capabilities/     Permissions minimales de l’application
├── icons/            Icônes des installateurs
├── src/               Point d’entrée natif Rust
└── tauri.conf.json    Fenêtre, sécurité et formats de distribution
.github/workflows/
├── ci.yml             Vérification du code web
└── release.yml        Construction des installateurs Windows et Linux
```

## Principes

- Les analyses de mots de passe, de liens et de fichiers s’exécutent localement.
- L’annuaire est livré avec l’application et ne nécessite aucune API.
- Les services externes ne sont ouverts qu’après une action explicite de l’utilisateur.
- L’application de bureau ouvre ces services dans le navigateur par défaut grâce à une permission Tauri limitée aux URL usuelles.
- Aucune clé secrète ne doit être placée dans le code client.

## Distribution

Le workflow de publication produit des installateurs Windows (NSIS et MSI) et Linux (DEB et AppImage). Il se lance manuellement et crée un brouillon de version GitHub afin que les fichiers puissent être contrôlés avant publication.
