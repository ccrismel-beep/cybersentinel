
import { useState } from 'react'

type Analysis = {
  hostname: string
  score: number
  warnings: string[]
  observations: string[]
}

const shorteners = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'cutt.ly',
  'ow.ly',
  'buff.ly',
])

function LinkCheck() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [copyMessage, setCopyMessage] = useState('')

  // Analyser une adresse Internet
  function analyzeLink() {
    setError('')
    setAnalysis(null)
    setCopyMessage('')

    if (!url.trim()) {
      setError('Veuillez saisir une adresse Internet.')
      return
    }

    try {
      const parsed = new URL(url.trim())

      if (
        parsed.protocol !== 'http:' &&
        parsed.protocol !== 'https:'
      ) {
        setError('Seuls les liens HTTP et HTTPS sont acceptés.')
        return
      }

      const hostname = parsed.hostname.toLowerCase()
      const warnings: string[] = []
      const observations: string[] = []
      let score = 0

      // Connexion HTTP
      if (parsed.protocol === 'http:') {
        warnings.push(
          'Le lien utilise HTTP : la connexion n’est pas chiffrée par HTTPS.'
        )
        score += 2
      } else {
        observations.push('Le lien utilise HTTPS.')
      }

      // Adresse IPv4 ou IPv6
      const isIPv4 =
        /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)

      const isIPv6 =
        hostname.startsWith('[') &&
        hostname.endsWith(']')

      if (isIPv4 || isIPv6) {
        warnings.push(
          'Le lien utilise une adresse IP plutôt qu’un nom de domaine.'
        )
        score += 2
      }

      // Raccourcisseurs d'URL
      if (shorteners.has(hostname)) {
        warnings.push(
          'Ce lien utilise un raccourcisseur : sa destination finale n’est pas visible.'
        )
        score += 2
      }

      // Identifiants avant le symbole @
      if (parsed.username || parsed.password) {
        warnings.push(
          'Le lien contient des identifiants avant le symbole @, ce qui peut masquer sa destination.'
        )
        score += 3
      }

      // Termes liés à l'authentification
      const sensitiveWords =
        /login|signin|verify|verification|password|account|secure|connexion/i

      if (sensitiveWords.test(parsed.pathname)) {
        warnings.push(
          'Le chemin du lien contient des termes liés à un compte ou à une authentification.'
        )
        score += 1
      }

      // Domaines internationalisés
      if (hostname.includes('xn--')) {
        warnings.push(
          'Le domaine contient un nom internationalisé encodé, qui mérite une vérification visuelle.'
        )
        score += 1
      }

      if (warnings.length === 0) {
        observations.push(
          'Aucun des indices suspects recherchés n’a été détecté.'
        )
      }

      setAnalysis({
        hostname,
        score,
        warnings,
        observations,
      })
    } catch {
      setError(
        'Adresse invalide. Exemple : https://example.com'
      )
    }
  }

  // Déterminer le niveau de vigilance
  function getRiskLabel(score: number): string {
    if (score >= 4) return 'Vigilance élevée'
    if (score >= 2) return 'Vigilance modérée'
    if (score >= 1) return 'Point à vérifier'
    return 'Aucun indice détecté'
  }

  // Générer le rapport commun
  function buildReport(): string {
    if (!analysis) return ''

    return [
      'CYBERSENTINEL — RAPPORT LINKCHECK',
      '--------------------------------',
      `Adresse analysée : ${url}`,
      `Domaine : ${analysis.hostname}`,
      `Niveau indicatif : ${getRiskLabel(analysis.score)}`,
      '',
      'POINTS DE VIGILANCE',
      ...(analysis.warnings.length
        ? analysis.warnings.map(item => `- ${item}`)
        : ['Aucun indice suspect détecté.']),
      '',
      'OBSERVATIONS',
      ...analysis.observations.map(item => `- ${item}`),
      '',
      'Cette analyse est indicative.',
      'Elle ne garantit pas qu’un lien est sûr.',
    ].join('\n')
  }

  // Copier le rapport dans le presse-papiers
  async function copyReport() {
    if (!analysis) return

    try {
      await navigator.clipboard.writeText(buildReport())
      setCopyMessage(
        'Rapport copié dans le presse-papiers !'
      )
    } catch {
      setCopyMessage(
        'Impossible de copier le rapport. Vérifiez les autorisations.'
      )
    }
  }

  // Télécharger le rapport en fichier TXT
  function downloadReport() {
    if (!analysis) return

    const report = buildReport()

    const blob = new Blob([report], {
      type: 'text/plain;charset=utf-8',
    })

    const downloadUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = downloadUrl
    link.download = 'CyberSentinel-LinkCheck.txt'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl)
    }, 1000)
  }

  const riskLabel = analysis
    ? getRiskLabel(analysis.score)
    : ''

  const riskColor = !analysis
    ? '#94a3b8'
    : analysis.score >= 4
      ? '#ef4444'
      : analysis.score >= 2
        ? '#f97316'
        : analysis.score >= 1
          ? '#eab308'
          : '#22c55e'

  return (
    <section className="link-check">
      <h2>🔗 LinkCheck</h2>

      <p>
        Recherchez certains indices suspects dans
        une adresse Internet, sans ouvrir le lien.
      </p>

      <div className="password-result">
        <input
          type="text"
          value={url}
          onChange={e => {
            setUrl(e.target.value)
            setAnalysis(null)
            setError('')
            setCopyMessage('')
          }}
          placeholder="https://example.com"
          aria-label="Adresse Internet à analyser"
          spellCheck={false}
          autoComplete="off"
        />

        <button
          type="button"
          onClick={analyzeLink}
        >
          Analyser
        </button>
      </div>

      {error && (
        <p role="alert" style={{ color: '#ef4444' }}>
          {error}
        </p>
      )}

      {analysis && (
        <div className="analysis-result">
          <h3>Résultat de l'analyse</h3>

          <div className="link-report-actions">
            <button
              type="button"
              onClick={copyReport}
            >
              📋 Copier le rapport
            </button>

            <button
              type="button"
              onClick={downloadReport}
            >
              📥 Télécharger le rapport (.txt)
            </button>
          </div>

          {copyMessage && (
            <p role="status" aria-live="polite">
              {copyMessage}
            </p>
          )}

          <p>
            Domaine ou hôte :{' '}
            <strong>{analysis.hostname}</strong>
          </p>

          <p>
            Niveau indicatif :{' '}
            <strong style={{ color: riskColor }}>
              {riskLabel}
            </strong>
          </p>

          {/* Jauge de vigilance */}
          <div
            className="link-risk-track"
            role="progressbar"
            aria-label="Indice de vigilance"
            aria-valuemin={0}
            aria-valuemax={6}
            aria-valuenow={Math.min(analysis.score, 6)}
            aria-valuetext={riskLabel}
          >
            <div
              className="link-risk-fill"
              style={{
                width: `${
                  analysis.score === 0
                    ? 12
                    : Math.min(
                        100,
                        Math.round(
                          (analysis.score / 6) * 100
                        )
                      )
                }%`,
                backgroundColor: riskColor,
              }}
            />
          </div>

          <p className="link-risk-caption">
            Indice de vigilance basé sur les
            caractéristiques de l'adresse,
            sans vérification de réputation.
          </p>

          {analysis.warnings.length > 0 && (
            <>
              <h4>⚠️ Points de vigilance</h4>

              <ul>
                {analysis.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </>
          )}

          {analysis.observations.length > 0 && (
            <>
              <h4>Observations</h4>

              <ul>
                {analysis.observations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          )}

          <p className="privacy-note">
            Cette analyse ne consulte aucune base
            de réputation et ne vérifie pas la
            destination finale des redirections.
            Elle ne garantit jamais qu'un lien est sûr.
          </p>
        </div>
      )}

      <p className="privacy-note">
        🔒 Analyse locale : le lien n'est pas ouvert
        automatiquement et n'est pas transmis à un
        service externe par cet outil.
      </p>
    </section>
  )
}

export default LinkCheck
