
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
    <section className="secure-pass">
      <h2>🔐 SecurePass</h2>

      <p>
        Générez des mots de passe robustes
        et analysez leur sécurité.
      </p>

      {/* Résultat du générateur */}
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

      {/* Options du générateur */}
      <div className="password-options">
        <label htmlFor="password-length">
          Longueur : {length} caractères
        </label>

        <input
          id="password-length"
          type="range"
          min="12"
          max="64"
          value={length}
          onChange={e =>
            setLength(Number(e.target.value))
          }
        />

        <label>
          <input
            type="checkbox"
            checked={upper}
            onChange={e =>
              setUpper(e.target.checked)
            }
          />
          Majuscules (A-Z)
        </label>

        <label>
          <input
            type="checkbox"
            checked={lower}
            onChange={e =>
              setLower(e.target.checked)
            }
          />
          Minuscules (a-z)
        </label>

        <label>
          <input
            type="checkbox"
            checked={digits}
            onChange={e =>
              setDigits(e.target.checked)
            }
          />
          Chiffres (0-9)
        </label>

        <label>
          <input
            type="checkbox"
            checked={symbols}
            onChange={e =>
              setSymbols(e.target.checked)
            }
          />
          Symboles (!@#$...)
        </label>
      </div>

      {/* Bouton de génération */}
      <button
        type="button"
        className="generate-button"
        onClick={generatePassword}
      >
        Générer un mot de passe
      </button>

      <p role="status" aria-live="polite">
        {message}
      </p>

      <p className="privacy-note">
        🔒 La génération est effectuée localement.
        Aucun mot de passe n'est envoyé à un serveur
        par cet outil. La copie utilise temporairement
        le presse-papiers de votre ordinateur.
      </p>

      {/* Séparation des deux outils */}
      <hr className="tool-divider" />

      {/* Analyseur temporairement désactivé */}
      <PasswordAnalyzer />
    </section>
  )
}

export default SecurePass
