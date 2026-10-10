
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { createSHA256 } from 'hash-wasm'

const CHUNK_SIZE = 4 * 1024 * 1024

function HashCheck() {
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState(0)
  const [hash, setHash] = useState('')
  const [referenceHash, setReferenceHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [copyMessage, setCopyMessage] = useState('')

  // Identifiant du calcul en cours
  const calculationId = useRef(0)

  // Empêcher un ancien calcul de modifier l'interface
  // lorsque le composant est fermé
  useEffect(() => {
    return () => {
      calculationId.current += 1
    }
  }, [])

  // Calcul SHA-256 par morceaux
  async function handleFile(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    // Annuler logiquement le calcul précédent
    calculationId.current += 1
    const currentId = calculationId.current

    setFileName('')
    setFileSize(0)
    setHash('')
    setReferenceHash('')
    setProgress(0)
    setError('')
    setCopyMessage('')
    setLoading(false)

    if (!file) return

    setFileName(file.name)
    setFileSize(file.size)
    setLoading(true)

    try {
      // Initialiser le moteur SHA-256
      const hasher = await createSHA256()
      hasher.init()

      let offset = 0

      // Lire progressivement le fichier
      while (offset < file.size) {
        // Vérifier si le calcul a été annulé
        if (calculationId.current !== currentId) {
          return
        }

        const end = Math.min(
          offset + CHUNK_SIZE,
          file.size
        )

        const chunk = file.slice(offset, end)
        const buffer = await chunk.arrayBuffer()

        if (calculationId.current !== currentId) {
          return
        }

        // Ajouter le morceau au calcul SHA-256
        hasher.update(new Uint8Array(buffer))

        offset = end

        const percentage = Math.round(
          (offset / file.size) * 100
        )

        setProgress(percentage)

        // Laisser le navigateur actualiser l'interface
        await new Promise<void>(resolve => {
          setTimeout(resolve, 0)
        })
      }

      if (calculationId.current !== currentId) {
        return
      }

      // Calculer l'empreinte finale
      // Fonctionne aussi pour un fichier vide
      const result = hasher.digest('hex')

      setHash(result)
      setProgress(100)
    } catch {
      if (calculationId.current === currentId) {
        setError(
          "Impossible de calculer l'empreinte du fichier."
        )
      }
    } finally {
      if (calculationId.current === currentId) {
        setLoading(false)
      }
    }
  }

  // Annuler le calcul
  function cancelCalculation() {
    calculationId.current += 1

    setLoading(false)
    setHash('')
    setProgress(0)
    setError('Calcul annulé par l’utilisateur.')
  }

  // Copier l'empreinte SHA-256
  async function copyHash() {
    if (!hash) return

    try {
      await navigator.clipboard.writeText(hash)

      setCopyMessage(
        'Empreinte SHA-256 copiée dans le presse-papiers !'
      )
    } catch {
      setCopyMessage(
        "Impossible de copier l'empreinte. Vérifiez les autorisations du navigateur."
      )
    }
  }

  // Vérifier l'empreinte de référence
  const normalizedReference =
    referenceHash.trim().toLowerCase()

  const referenceIsValid =
    /^[a-f0-9]{64}$/.test(normalizedReference)

  const hashesMatch =
    hash !== '' &&
    referenceIsValid &&
    hash === normalizedReference

  // Afficher une taille de fichier lisible
  function formatFileSize(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} octets`
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} Ko`
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} Mo`
    }

    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`
  }

  return (
    <section className="hash-check tool-workspace" aria-label="Espace HashCheck">
      <article className="workspace-panel hash-file-panel">
        <header className="panel-heading">
          <span className="eyebrow">Empreinte SHA-256</span>
          <h2>Sélectionner un fichier</h2>
          <p>
            Les fichiers volumineux sont analysés progressivement, sans être
            chargés entièrement en mémoire.
          </p>
        </header>

        <div className="password-options">
          <label htmlFor="hash-file">Fichier à analyser</label>
          <input id="hash-file" type="file" onChange={handleFile} />
        </div>
      </article>

      {/* Informations du fichier */}
      {fileName && (
        <article className="analysis-result">
          <header className="panel-heading">
            <span className="eyebrow">Diagnostic d’intégrité</span>
            <h3>Informations du fichier</h3>
          </header>

          <p>
            Nom : <strong>{fileName}</strong>
          </p>

          <p>
            Taille :{' '}
            <strong>
              {formatFileSize(fileSize)}
            </strong>
          </p>

          {/* Barre de progression */}
          {loading && (
            <div className="hash-progress-block">
              <h3>Calcul SHA-256 en cours</h3>

              <div
                className="hash-progress-track"
                role="progressbar"
                aria-label="Progression du calcul SHA-256"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
              >
                <div
                  className="hash-progress-fill"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <p role="status">
                ⏳ Progression : {progress} %
              </p>

              <button
                type="button"
                onClick={cancelCalculation}
                className="danger-button"
              >
                ✖ Annuler le calcul
              </button>
            </div>
          )}

          {/* Empreinte calculée */}
          {hash && !loading && (
            <>
              <h3>Empreinte SHA-256 calculée</h3>

              <p className="hash-value">
                {hash}
              </p>

              <button
                type="button"
                onClick={copyHash}
              >
                📋 Copier l'empreinte SHA-256
              </button>

              {copyMessage && (
                <p
                  className={`status-message ${
                    copyMessage.startsWith('Impossible')
                      ? 'status-message--error'
                      : 'status-message--success'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {copyMessage}
                </p>
              )}

              {/* Comparaison des empreintes */}
              <h3>Comparer les empreintes</h3>

              <label className="hash-reference-label" htmlFor="reference-hash">
                Empreinte SHA-256 de référence
              </label>

              <textarea
                id="reference-hash"
                className="hash-reference"
                value={referenceHash}
                onChange={e =>
                  setReferenceHash(e.target.value)
                }
                placeholder="Collez ici les 64 caractères de l'empreinte de référence"
                rows={3}
                spellCheck={false}
              />

              {normalizedReference !== '' && (
                <div
                  className={`comparison-status ${
                    !referenceIsValid
                      ? 'comparison-status--warning'
                      : hashesMatch
                        ? 'comparison-status--success'
                        : 'comparison-status--error'
                  }`}
                  role="status"
                  aria-live="polite"
                >
                  {!referenceIsValid ? (
                    <p>
                      ⚠️ Empreinte invalide :
                      saisissez exactement
                      64 caractères hexadécimaux.
                    </p>
                  ) : hashesMatch ? (
                    <p>
                      ✅ Correspondance :
                      les empreintes SHA-256
                      sont identiques.
                    </p>
                  ) : (
                    <p>
                      ❌ Différence détectée :
                      les empreintes SHA-256
                      ne correspondent pas.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </article>
      )}

      {/* Messages d'erreur ou d'annulation */}
      {error && (
        <p
          className={`status-message ${
            error.startsWith('Calcul annulé')
              ? 'status-message--warning'
              : 'status-message--error'
          }`}
          role="status"
        >
          {error}
        </p>
      )}

      {/* Confidentialité */}
      <div className="privacy-stack">
        <p className="privacy-note">
          🔒 Le calcul est effectué localement dans votre navigateur. Aucun
          fichier n'est envoyé à un serveur par cet outil.
        </p>

        <p className="privacy-note">
          Une empreinte identique confirme uniquement que le fichier correspond
          à la référence fournie. Elle ne garantit pas l'absence de logiciels
          malveillants.
        </p>
      </div>
    </section>
  )
}

export default HashCheck
