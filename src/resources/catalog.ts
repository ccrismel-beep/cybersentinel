export type SecurityResource = {
  id: string
  name: string
  category: string
  description: string
  url: string
  caution: string
}

export const securityResources: SecurityResource[] = [
  {
    id: 'hibp',
    name: 'Have I Been Pwned',
    category: 'Comptes et fuites',
    description:
      'Vérifie si une adresse e-mail apparaît dans des violations de données connues.',
    url: 'https://haveibeenpwned.com/',
    caution:
      "L'adresse saisie est transmise au service lorsque vous lancez une recherche.",
  },
  {
    id: 'virustotal',
    name: 'VirusTotal',
    category: 'Menaces et fichiers',
    description:
      'Consulte des analyses de fichiers, d’empreintes, de domaines et d’adresses web.',
    url: 'https://www.virustotal.com/gui/home/search',
    caution:
      'Ne téléversez jamais un fichier confidentiel : les éléments soumis peuvent être partagés avec des partenaires de sécurité.',
  },
  {
    id: 'synthid',
    name: 'Google SynthID',
    category: 'Contenus générés par IA',
    description:
      'Recherche un filigrane SynthID dans certains contenus créés ou modifiés par une IA compatible.',
    url: 'https://deepmind.google/models/synthid/',
    caution:
      "L'absence de filigrane ne prouve pas qu'un contenu n'a pas été généré par une IA.",
  },
  {
    id: 'urlscan',
    name: 'urlscan.io',
    category: 'Liens et sites web',
    description:
      'Observe le chargement d’une page web et les connexions qu’elle déclenche dans un environnement distant.',
    url: 'https://urlscan.io/',
    caution:
      'Vérifiez le niveau de visibilité avant toute analyse : une adresse soumise peut devenir publique.',
  },
  {
    id: 'observatory',
    name: 'MDN HTTP Observatory',
    category: 'Audit de sites web',
    description:
      'Évalue les en-têtes HTTP et plusieurs protections de sécurité d’un site public.',
    url: 'https://developer.mozilla.org/en-US/observatory',
    caution:
      'Ce service analyse un site accessible publiquement et ne remplace pas un audit de sécurité complet.',
  },
  {
    id: 'cybermalveillance',
    name: 'Cybermalveillance.gouv.fr',
    category: 'Aide et prévention',
    description:
      'Propose un diagnostic, des conseils et une assistance aux victimes de cybermalveillance en France.',
    url: 'https://www.cybermalveillance.gouv.fr/',
    caution:
      'Utilisez le parcours officiel adapté à votre situation et à votre profil.',
  },
  {
    id: 'cert-fr',
    name: 'CERT-FR / ANSSI',
    category: 'Alertes et recommandations',
    description:
      'Publie des avis, alertes et recommandations officielles sur les menaces informatiques.',
    url: 'https://www.cert.ssi.gouv.fr/',
    caution:
      'Les avis techniques peuvent nécessiter des connaissances d’administration système.',
  },
]
