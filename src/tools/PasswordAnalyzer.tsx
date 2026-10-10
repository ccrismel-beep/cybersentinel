
import { useState } from 'react'
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core'
import * as common from '@zxcvbn-ts/language-common'

// Configuration du moteur d'analyse
zxcvbnOptions.setOptions({
  dictionary: {
    ...common.dictionary,
  },
  graphs: common.adjacencyGraphs,
})

// Niveaux de robustesse
const levels = [
  'Très faible',
  'Faible',
  'Moyen',
  'Fort',
  'Très fort',
]

// Couleurs associées
const colors = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#10b981',
]

function PasswordAnalyzer() {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  // Analyse locale
  const result = password ? zxcvbn(password) : null
  const score = result?.score ?? 0

  function clearPassword() {
    setPassword('')
    setVisible(false)
  }

  return (
    <section className="password-analyzer">
      <h3>🛡️ Analyseur de mots de passe</h3>

      <p>
        Vérifiez la robustesse d'un mot de passe
        fictif directement dans votre navigateur.
      </p>

      <div className="password-result">
        <input
          type={visible ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Saisissez un mot de passe fictif"
          aria-label="Mot de passe à analyser"
          autoComplete="off"
          spellCheck={false}
        />

        <button
          type="button"
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Masquer' : 'Afficher'}
        </button>

        <button
          type="button"
          onClick={clearPassword}
          disabled={!password}
        >
          Effacer
        </button>
      </div>

      {result && (
        <div className="analysis-result">
          <p>
            Robustesse estimée :{' '}
            <strong style={{ color: colors[score] }}>
              {levels[score]}
            </strong>
          </p>

          <div
            className="strength-track"
            role="progressbar"
            aria-label="Robustesse estimée"
            aria-valuemin={0}
            aria-valuemax={4}
            aria-valuenow={score}
            aria-valuetext={levels[score]}
          >
            <div
              className="strength-fill"
              style={{
                width: `${(score + 1) * 20}%`,
                backgroundColor: colors[score],
              }}
            />
          </div>

          <p>
            Longueur : {password.length} caractères
          </p>

          {result.feedback.warning && (
            <p>
              ⚠️ {result.feedback.warning}
            </p>
          )}

          <p className="privacy-note">
            Cette estimation est indicative et
            ne garantit pas une sécurité absolue.
          </p>
        </div>
      )}

      <p className="privacy-note">
        🔒 Analyse effectuée localement.
        Aucun mot de passe n'est envoyé à un
        serveur par cet outil. Utilisez uniquement
        des mots de passe fictifs pour vos tests.
      </p>
    </section>
  )
}

export default PasswordAnalyzer
