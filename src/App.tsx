
import { useState } from 'react'
import SecurePass from './tools/SecurePass'
import LinkCheck from './tools/LinkCheck'
import HashCheck from './tools/HashCheck'
import ResourceDirectory from './tools/ResourceDirectory'
import './App.css'

function App() {
  const [activeTool, setActiveTool] = useState('')

  const tools = [
    {
      id: 'password',
      icon: '🔐',
      name: 'SecurePass',
      description: 'Vérifiez et générez des mots de passe robustes.',
    },
    {
      id: 'links',
      icon: '🔗',
      name: 'LinkCheck',
      description: 'Analysez les liens potentiellement suspects.',
    },
    {
      id: 'files',
      icon: '📁',
      name: 'HashCheck',
      description: "Vérifiez l'intégrité de vos fichiers.",
    },
    {
      id: 'resources',
      icon: '🧭',
      name: 'Ressources',
      description: 'Retrouvez des services de cybersécurité fiables.',
    },
  ]

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🛡️ CyberSentinel</div>
        <span className="version">Version 0.6</span>
      </header>

      <main className="main">
        <section className="hero">
          <h1>Votre sécurité numérique, simplifiée.</h1>
          <p>
            Découvrez une boîte à outils gratuite pour
            mieux protéger votre vie numérique.
          </p>
        </section>

        <section className="tools">
          <h2>Nos outils de cybersécurité</h2>

          <div className="tool-grid">
            {tools.map((tool) => (
              <button
                type="button"
                className="tool-card"
                key={tool.id}
                onClick={() => setActiveTool(tool.name)}
              >
                <span className="tool-icon">
                  {tool.icon}
                </span>

                <h3>{tool.name}</h3>

                <p>{tool.description}</p>

                <span className="tool-action">
                  Découvrir →
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Affichage de l'outil sélectionné */}
        {activeTool && (
          <section className="selection">

            {/* Générateur et analyseur de mots de passe */}
            {activeTool === 'SecurePass' && (
              <SecurePass />
            )}

            {/* Analyseur de liens */}
            {activeTool === 'LinkCheck' && (
              <LinkCheck />
            )}

            {/* Vérificateur d'intégrité des fichiers */}
            {activeTool === 'HashCheck' && (
              <HashCheck />
            )}

            {/* Annuaire de ressources externes */}
            {activeTool === 'Ressources' && (
              <ResourceDirectory />
            )}

            <button
              type="button"
              onClick={() => setActiveTool('')}
            >
              Fermer
            </button>

          </section>
        )}
      </main>

      <footer>
        © 2026 CyberSentinel — La cybersécurité pour tous
      </footer>
    </div>
  )
}

export default App
