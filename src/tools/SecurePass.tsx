
import { useState } from 'react'
import PasswordAnalyzer from './PasswordAnalyzer'
// Groupes de caractères disponibles
const GROUPS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+?',
}

// Génération d'un indice aléatoire sans biais modulo
function randomIndex(max: number): number {
  const limit = Math.floor(4294967296 / max) * max
  const values = new Uint32Array(1)
  let value: number

  do {
    crypto.getRandomValues(values)
    value = values[0]
  } while (value >= limit)

  return value % max
}

function SecurePass() {
  const [length, setLength] = useState(20)
  const [upper, setUpper] = useState(true)
  const [lower, setLower] = useState(true)
  const [digits, setDigits] = useState(true)
  const [symbols, setSymbols] = useState(true)

  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('')

  // Générateur de mots de passe
  function generatePassword() {
    const selected = [
      upper ? GROUPS.upper : '',
      lower ? GROUPS.lower : '',
      digits ? GROUPS.digits : '',
      symbols ? GROUPS.symbols : '',
    ].filter(Boolean)

    if (selected.length === 0) {
      setPassword('')
      setMessage(
        'Sélectionne au moins un type de caractères.'
      )
      return
    }

    const allChars = selected.join('')

    // Au moins un caractère de chaque catégorie choisie
    const result = selected.map(
      group => group[randomIndex(group.length)]
    )

    // Compléter jusqu'à la longueur demandée
    while (result.length < length) {
      result.push(
        allChars[randomIndex(allChars.length)]
      )
    }

    // Mélanger les caractères
    for (let i = result.length - 1; i > 0; i--) {
      const j = randomIndex(i + 1)

      ;[result[i], result[j]] = [
        result[j],
        result[i],
      ]
    }

    setPassword(result.join(''))
    setVisible(false)
    setMessage('Mot de passe généré avec succès.')
  }

  // Copier dans le presse-papiers
  async function copyPassword() {
    if (!password) return

    try {
      await navigator.clipboard.writeText(password)
      setMessage('Mot de passe copié !')
    } catch {
      setMessage(
        'Impossible de copier le mot de passe.'
      )
    }
  }

  return (
    <section className="secure-pass tool-workspace" aria-label="Espace SecurePass">
      <div className="workspace-grid">
        <article className="workspace-panel">
          <header className="panel-heading">
            <span className="eyebrow">Générateur local</span>
            <h2>Créer un mot de passe</h2>
            <p>
              Configurez les caractères autorisés puis générez une valeur
              aléatoire directement sur cet appareil.
            </p>
          </header>

          <div className="password-result">
            <input
              type={visible ? 'text' : 'password'}
              value={password}
              readOnly
              aria-label="Mot de passe généré"
              placeholder="Votre mot de passe apparaîtra ici"
            />

            <button
              type="button"
              onClick={() => setVisible(!visible)}
              disabled={!password}
            >
              {visible ? 'Masquer' : 'Afficher'}
            </button>

            <button
              type="button"
              onClick={copyPassword}
              disabled={!password}
            >
              Copier
            </button>
          </div>

          <fieldset className="password-options">
            <legend>Paramètres de génération</legend>

            <label htmlFor="password-length">
              Longueur : {length} caractères
            </label>

            <input
              id="password-length"
              type="range"
              min="12"
              max="64"
              value={length}
              onChange={e => setLength(Number(e.target.value))}
            />

            <label>
              <input
                type="checkbox"
                checked={upper}
                onChange={e => setUpper(e.target.checked)}
              />
              Majuscules (A-Z)
            </label>

            <label>
              <input
                type="checkbox"
                checked={lower}
                onChange={e => setLower(e.target.checked)}
              />
              Minuscules (a-z)
            </label>

            <label>
              <input
                type="checkbox"
                checked={digits}
                onChange={e => setDigits(e.target.checked)}
              />
              Chiffres (0-9)
            </label>

            <label>
              <input
                type="checkbox"
                checked={symbols}
                onChange={e => setSymbols(e.target.checked)}
              />
              Symboles (!@#$...)
            </label>
          </fieldset>

          <button
            type="button"
            className="generate-button"
            onClick={generatePassword}
          >
            Générer un mot de passe
          </button>

          {message && (
            <p
              className={`status-message ${
                message.startsWith('Mot')
                  ? 'status-message--success'
                  : 'status-message--error'
              }`}
              role="status"
              aria-live="polite"
            >
              {message}
            </p>
          )}

          <div className="privacy-stack">
            <p className="privacy-note">
              🔒 La génération est effectuée localement. Aucun mot de passe
              n'est envoyé à un serveur par cet outil. La copie utilise
              temporairement le presse-papiers de votre ordinateur.
            </p>
          </div>
        </article>

        <article className="workspace-panel">
          <PasswordAnalyzer />
        </article>
      </div>
    </section>
  )
}

export default SecurePass
