# CyberSentinel

CyberSentinel est une boîte à outils de cybersécurité locale, gratuite et open source. Elle aide les particuliers à créer et analyser des mots de passe, examiner des liens et vérifier l’intégrité de fichiers sans envoyer automatiquement leurs données à un serveur.

## Fonctionnalités

- **SecurePass** : génération cryptographiquement sûre et estimation locale de la robustesse des mots de passe.
- **LinkCheck** : analyse heuristique d’une adresse web sans l’ouvrir ni la transmettre.
- **HashCheck** : calcul SHA-256 progressif, comparaison d’empreintes, copie et prise en charge des fichiers volumineux.
- **Ressources** : annuaire consultable de services de cybersécurité officiels ou reconnus, sans API ni clé.

## Vie privée

Les trois outils d’analyse fonctionnent dans le navigateur, sur l’appareil de l’utilisateur. CyberSentinel ne comporte ni compte, ni télémétrie, ni clé API. Les liens de l’annuaire s’ouvrent uniquement à la demande de l’utilisateur ; le service externe applique alors sa propre politique de confidentialité.

Consultez [docs/privacy.md](docs/privacy.md) pour le détail.

## Installation pour le développement

Prérequis : Node.js 20.19 ou une version plus récente compatible avec Vite 8.

```bash
git clone https://github.com/ccrismel-beep/cybersentinel.git
cd cybersentinel
npm install
npm run dev
```

Le serveur de développement indique l’adresse locale à ouvrir dans le navigateur.

## Vérification

```bash
npm run lint
npm run build
```

## État du projet

La version 0.5 est une application web locale. La transformation en application de bureau installable avec Tauri est prévue dans une étape ultérieure.

## Contribuer et signaler un problème

Consultez [CONTRIBUTING.md](CONTRIBUTING.md). Pour une vulnérabilité, suivez impérativement la procédure privée décrite dans [SECURITY.md](SECURITY.md).

## Licence

CyberSentinel est distribué sous licence [MIT](LICENSE).
