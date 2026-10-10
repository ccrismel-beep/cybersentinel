import { useState } from 'react'
import SecurePass from './tools/SecurePass'
import LinkCheck from './tools/LinkCheck'
import HashCheck from './tools/HashCheck'
import ResourceDirectory from './tools/ResourceDirectory'
import './App.css'

type ToolName = 'SecurePass' | 'LinkCheck' | 'HashCheck' | 'Ressources'

type ToolDefinition = {
  id: string
  icon: string
  name: ToolName
  category: string
  description: string
  privacy: string
  external?: boolean
}

const tools: ToolDefinition[] = [
  {
    id: 'password',
    icon: '🔐',
    name: 'SecurePass',
    category: 'Identité',
    description: 'Générez des mots de passe robustes et estimez leur résistance.',
    privacy: 'Traitement local',
  },
  {
    id: 'links',
    icon: '🔗',
    name: 'LinkCheck',
    category: 'Navigation',
    description: 'Repérez des caractéristiques suspectes sans ouvrir le lien.',
    privacy: 'Analyse locale',
  },
  {
    id: 'files',
    icon: '📁',
    name: 'HashCheck',
    category: 'Intégrité',
    description: "Calculez et comparez l’empreinte SHA-256 d’un fichier.",
    privacy: 'Calcul local',
  },
  {
    id: 'resources',
    icon: '🧭',
    name: 'Ressources',
    category: 'Références',
    description: 'Consultez une sélection de services de cybersécurité reconnus.',
    privacy: 'Ouverture à votre demande',
    external: true,
  },
]

function App() {
  const [activeTool, setActiveTool] = useState<ToolName | ''>('')
  const currentTool = tools.find(tool => tool.name === activeTool)

  function renderActiveTool() {
    switch (activeTool) {
      case 'SecurePass':
        return <SecurePass />
      case 'LinkCheck':
        return <LinkCheck />
      case 'HashCheck':
        return <HashCheck />
      case 'Ressources':
        return <ResourceDirectory />
      default:
        return null
    }
  }

  return (
    <div className={`app${activeTool ? ' app--tool-open' : ''}`}>
      <header className="app-header">
        <button
          type="button"
          className="brand"
          onClick={() => setActiveTool('')}
          aria-label="Retourner au tableau de bord CyberSentinel"
        >
          <span className="brand-mark" aria-hidden="true">🛡️</span>
          <span className="brand-copy">
            <strong>CyberSentinel</strong>
            <span>Security Command Center</span>
          </span>
        </button>

        <div className="header-status" aria-label="État de l’application">
          <span className="local-badge">Local-first</span>
          <span className="status-indicator">
            <span className="status-dot" aria-hidden="true" />
            Analyse locale et navigation contrôlée
          </span>
          <span className="version">v0.6</span>
        </div>
      </header>

      <main className="main">
        {!activeTool ? (
          <>
            <section className="hero" aria-labelledby="dashboard-title">
              <div className="hero-content">
                <span className="eyebrow">Centre de sécurité local</span>
                <h1 id="dashboard-title">Votre sécurité numérique, simplifiée.</h1>
                <p className="hero-lead">
                  Analysez des mots de passe, des liens et des fichiers sans
                  transmission automatique de vos données.
                </p>
                <div className="hero-privacy">
                  <span aria-hidden="true">🔒</span>
                  <span>
                    Les outils d’analyse s’exécutent sur cet appareil. Les
                    services externes ne s’ouvrent qu’à votre demande.
                  </span>
                </div>
              </div>

              <div className="hero-visual" aria-hidden="true">
                <div className="radar-ring radar-ring--outer" />
                <div className="radar-ring radar-ring--middle" />
                <div className="radar-ring radar-ring--inner" />
                <span className="hero-shield">🛡️</span>
                <span className="radar-node radar-node--one" />
                <span className="radar-node radar-node--two" />
                <span className="radar-node radar-node--three" />
              </div>
            </section>

            <section className="tools" aria-labelledby="tools-title">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Modules disponibles</span>
                  <h2 id="tools-title">Outils de cybersécurité</h2>
                </div>
                <p>Choisissez un module pour commencer une analyse.</p>
              </div>

              <div className="tool-grid">
                {tools.map(tool => (
                  <button
                    type="button"
                    className={`tool-card tool-card--${tool.id}`}
                    key={tool.id}
                    onClick={() => setActiveTool(tool.name)}
                    aria-label={`Ouvrir ${tool.name}`}
                  >
                    <span className="tool-card-topline">
                      <span className="tool-category">{tool.category}</span>
                      <span className="tool-icon" aria-hidden="true">
                        {tool.icon}
                      </span>
                    </span>

                    <span className="tool-name">{tool.name}</span>
                    <span className="tool-description">{tool.description}</span>

                    <span
                      className={`privacy-badge${
                        tool.external ? ' privacy-badge--external' : ''
                      }`}
                    >
                      {tool.external ? '↗' : '●'} {tool.privacy}
                    </span>

                    <span className="tool-card-footer">
                      <span>Ouvrir le module</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="trust-panel" aria-labelledby="trust-title">
              <div className="trust-heading">
                <span className="trust-icon" aria-hidden="true">◇</span>
                <div>
                  <span className="eyebrow">Confidentialité vérifiable</span>
                  <h2 id="trust-title">Conçu pour limiter les transferts</h2>
                </div>
              </div>

              <div className="trust-facts">
                <p><span aria-hidden="true">✓</span> Aucun compte utilisateur</p>
                <p><span aria-hidden="true">✓</span> Aucune télémétrie</p>
                <p><span aria-hidden="true">✓</span> Navigation externe contrôlée</p>
              </div>
            </section>
          </>
        ) : currentTool ? (
          <section className={`tool-page tool-page--${currentTool.id}`}>
            <nav className="tool-navigation" aria-label="Navigation de l’outil">
              <button type="button" onClick={() => setActiveTool('')}>
                <span aria-hidden="true">←</span>
                Tableau de bord
              </button>
              <span className="tool-breadcrumb">
                CyberSentinel <span aria-hidden="true">/</span>{' '}
                <strong>{currentTool.name}</strong>
              </span>
            </nav>

            <header className="tool-page-header">
              <span className="tool-page-icon" aria-hidden="true">
                {currentTool.icon}
              </span>
              <div className="tool-page-heading">
                <span className="eyebrow">{currentTool.category}</span>
                <h1>{currentTool.name}</h1>
                <p>{currentTool.description}</p>
              </div>
              <span
                className={`privacy-badge privacy-badge--large${
                  currentTool.external ? ' privacy-badge--external' : ''
                }`}
              >
                {currentTool.external ? '↗' : '●'} {currentTool.privacy}
              </span>
            </header>

            <div className="tool-surface">{renderActiveTool()}</div>
          </section>
        ) : null}
      </main>

      <footer className="app-footer">
        <span>© 2026 CyberSentinel</span>
        <span>Protection locale · Open source · Sans télémétrie</span>
      </footer>
    </div>
  )
}

export default App
