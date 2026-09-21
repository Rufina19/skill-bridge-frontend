import { useState } from "react"

function LoginPage({ onLogin, onBack }) {
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(e) {
    e.preventDefault()

    const trimmed = name.trim()
    if (!trimmed) {
      setError("Please enter your name")
      return
    }

    setError("")
    onLogin(trimmed)
  }

  return (
    <div className="container login-page">
      <section className="login-panel">
        <p className="eyebrow">Member Access</p>
        <h1 className="title">Login to SkillBridge</h1>
        <p className="subtitle">
          Enter your name to start sharing skills and responding to help requests.
        </p>

        <form className="share-form login-form" onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <label className="share-label">
            Your Display Name
            <input
              className="share-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              autoComplete="username"
              autoFocus
            />
          </label>

          <button className="share-button" type="submit">
            Continue
          </button>

          <button className="login-back-button" type="button" onClick={onBack}>
            Back to Home
          </button>
        </form>
      </section>
    </div>
  )
}

export default LoginPage
