import { useMemo, useState } from 'react'
import { securityResources } from '../resources/catalog'

const ALL_CATEGORIES = 'Toutes les catégories'

function ResourceDirectory() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState(ALL_CATEGORIES)

  const categories = useMemo(
    () => [
      ALL_CATEGORIES,
      ...Array.from(
        new Set(securityResources.map(resource => resource.category))
      ),
    ],
    []
  )

  const normalizedQuery = query.trim().toLocaleLowerCase('fr')

  const filteredResources = securityResources.filter(resource => {
    const matchesCategory =
      category === ALL_CATEGORIES || resource.category === category

    const searchableText = [
      resource.name,
      resource.category,
      resource.description,
    ]
      .join(' ')
      .toLocaleLowerCase('fr')

    return (
      matchesCategory &&
      (normalizedQuery === '' || searchableText.includes(normalizedQuery))
    )
  })

  return (
    <section className="resource-directory">
      <h2>🧭 Ressources de cybersécurité</h2>

      <p>
        Consultez une sélection de services officiels ou reconnus.
        CyberSentinel n’envoie aucune donnée automatiquement.
      </p>

      <div className="resource-filters">
        <label htmlFor="resource-search">
          Rechercher une ressource
        </label>

        <input
          id="resource-search"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="Exemple : fuite, fichier, site web…"
        />

        <label htmlFor="resource-category">
          Catégorie
        </label>

        <select
          id="resource-category"
          value={category}
          onChange={event => setCategory(event.target.value)}
        >
          {categories.map(item => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="resource-count" role="status" aria-live="polite">
        {filteredResources.length} ressource
        {filteredResources.length > 1 ? 's' : ''} affichée
        {filteredResources.length > 1 ? 's' : ''}
      </p>

      <div className="resource-grid">
        {filteredResources.map(resource => (
          <article className="resource-card" key={resource.id}>
            <span className="resource-category">
              {resource.category}
            </span>

            <h3>{resource.name}</h3>
            <p>{resource.description}</p>

            <p className="resource-caution">
              ⚠️ {resource.caution}
            </p>

            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
            >
              Ouvrir le site officiel ↗
            </a>
          </article>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <p className="resource-empty">
          Aucune ressource ne correspond à votre recherche.
        </p>
      )}

      <p className="privacy-note">
        🔒 Un service externe reçoit des informations uniquement lorsque
        vous ouvrez son site et utilisez ses fonctions. Consultez sa
        politique de confidentialité avant de transmettre une adresse,
        un lien ou un fichier.
      </p>
    </section>
  )
}

export default ResourceDirectory
