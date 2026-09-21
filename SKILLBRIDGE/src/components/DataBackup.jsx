function DataBackup({ skills, helpRequests, user, onRestore }) {
  function download() {
    const payload = {
      skillbridgeBackup: true,
      version: 1,
      exportedAt: new Date().toISOString(),
      skills,
      helpRequests,
      user,
    }
    const json = JSON.stringify(payload, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const stamp = new Date().toISOString().slice(0, 10)
    const a = document.createElement("a")
    a.href = url
    a.download = `skillbridge-backup-${stamp}.json`
    a.rel = "noopener"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        const ok =
          data &&
          typeof data === "object" &&
          (data.skillbridgeBackup === true ||
            Array.isArray(data.skills) ||
            Array.isArray(data.helpRequests))

        if (!ok) {
          window.alert(
            "That file does not look like a SkillBridge backup. Choose a .json file you exported from SkillBridge.",
          )
          e.target.value = ""
          return
        }

        onRestore(data)
      } catch {
        window.alert("Could not read that file. Make sure it is a JSON backup.")
      }
      e.target.value = ""
    }
    reader.readAsText(file)
  }

  return (
    <section className="data-backup" aria-labelledby="backup-heading">
      <h2 id="backup-heading" className="data-backup-title">
        Save or load backup
      </h2>
      <p className="data-backup-hint">
        Download everything (skills, help requests, your login name) as one
        file. Use <strong>Restore</strong> to load it back into this browser.
        You can also copy the file to a USB drive or email it to yourself.
      </p>
      <div className="data-backup-actions">
        <button
          type="button"
          className="data-backup-btn data-backup-btn-primary"
          onClick={download}
        >
          Download backup
        </button>
        <label className="data-backup-btn data-backup-btn-secondary">
          Restore from file
          <input
            type="file"
            accept="application/json,.json"
            className="data-backup-file"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </section>
  )
}

export default DataBackup
