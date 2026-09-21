import { useEffect, useState } from "react"
import "./App.css"

import DataBackup from "./components/DataBackup"
import HelpRequestsList from "./components/HelpRequestsList"
import LoginPage from "./components/LoginPage"
import Navbar from "./components/Navbar"
import RequestHelpForm from "./components/RequestHelpForm"
import ShareSkillForm from "./components/ShareSkillForm"
import SkillsList from "./components/SkillsList"

const STORAGE_KEY = "skillbridge-skills"
const REQUESTS_KEY = "skillbridge-help-requests"
const USER_KEY = "skillbridge-user"

const initialSkills = [
  { id: "1", name: "Python", student: "Alex", level: "Beginner", category: "Programming", description: "Basics, syntax, loops, and simple programs." },
  { id: "2", name: "Graphic Design", student: "Sam", level: "Intermediate", category: "Design", description: "Poster design, color choices, and layout feedback." },
  { id: "3", name: "Public Speaking", student: "Jordan", level: "Advanced", category: "Communication", description: "Presentation practice and confidence building." },
]

const LEVELS = new Set(["Beginner", "Intermediate", "Advanced"])

function loadSkills() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return initialSkills
    const parsed = JSON.parse(saved)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialSkills
  } catch {
    return initialSkills
  }
}

function loadUser() {
  try {
    const name = localStorage.getItem(USER_KEY)?.trim()
    return name || null
  } catch {
    return null
  }
}

function loadRequests() {
  try {
    const saved = localStorage.getItem(REQUESTS_KEY)
    if (!saved) return []
    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) return []
    return parsed.map((r) => ({
      ...r,
      offers: Array.isArray(r.offers) ? r.offers : [],
    }))
  } catch {
    return []
  }
}

function normalizeImportedSkills(raw) {
  if (!Array.isArray(raw) || raw.length === 0) return initialSkills

  return raw.map((s) => ({
    id: typeof s?.id === "string" && s.id ? s.id : crypto.randomUUID(),
    name: String(s?.name ?? "").trim() || "Untitled Skill",
    student: String(s?.student ?? "").trim() || "Unknown",
    level: LEVELS.has(s?.level) ? s.level : "Beginner",
    category: String(s?.category ?? "").trim() || "General",
    description: String(s?.description ?? "").trim(),
  }))
}

function normalizeImportedRequests(raw) {
  if (!Array.isArray(raw)) return []

  return raw.map((r) => ({
    id: typeof r?.id === "string" && r.id ? r.id : crypto.randomUUID(),
    student: String(r?.student ?? "").trim() || "Unknown",
    topic: String(r?.topic ?? "").trim() || "Untitled",
    category: String(r?.category ?? "").trim() || "General",
    message: typeof r?.message === "string" ? r.message : "",
    offers: Array.isArray(r?.offers)
      ? r.offers.filter((o) => typeof o === "string" && o.trim())
      : [],
    status: ["Open", "Matched", "Closed"].includes(r?.status) ? r.status : "Open",
  }))
}

function App() {
  const [skills, setSkills] = useState(loadSkills)
  const [helpRequests, setHelpRequests] = useState(loadRequests)
  const [user, setUser] = useState(loadUser)
  const [view, setView] = useState("home")

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(skills))
  }, [skills])

  useEffect(() => {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(helpRequests))
  }, [helpRequests])

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, user)
    } else {
      localStorage.removeItem(USER_KEY)
    }
  }, [user])

  function handleAddSkill(skill) {
    setSkills((prev) => [skill, ...prev])
  }

  function handleRemoveSkill(skillId) {
    setSkills((prev) => prev.filter((s) => s.id !== skillId))
  }

  function handleUpdateSkill(skillId, updates) {
    setSkills((prev) =>
      prev.map((skill) => (skill.id === skillId ? { ...skill, ...updates } : skill)),
    )
  }

  function handleAddHelpRequest(request) {
    setHelpRequests((prev) => [{ ...request, offers: request.offers ?? [] }, ...prev])
  }

  function handleRemoveHelpRequest(requestId) {
    setHelpRequests((prev) => prev.filter((r) => r.id !== requestId))
  }

  function handleUpdateHelpRequest(requestId, updates) {
    setHelpRequests((prev) =>
      prev.map((request) => (
        request.id === requestId ? { ...request, ...updates } : request
      )),
    )
  }

  function handleOfferHelp(requestId) {
    const name = user?.trim()
    if (!name) return

    setHelpRequests((prev) =>
      prev.map((r) => {
        if (r.id !== requestId) return r

        const offers = Array.isArray(r.offers) ? r.offers : []
        if (offers.some((o) => o.trim().toLowerCase() === name.toLowerCase())) return r

        return { ...r, offers: [...offers, name], status: "Matched" }
      }),
    )
  }

  function handleRestoreBackup(data) {
    const ok = window.confirm("Replace all SkillBridge data with this backup?")
    if (!ok) return

    setSkills(normalizeImportedSkills(data.skills))
    setHelpRequests(normalizeImportedRequests(data.helpRequests ?? []))
    setUser(typeof data.user === "string" && data.user.trim() ? data.user.trim() : null)
    setView("home")
  }

  function handleLogin(name) {
    setUser(name)
    setView("home")
  }

  function handleLogout() {
    setUser(null)
    setView("home")
  }

  function goHome() {
    setView("home")
  }

  function goSkills() {
    setView("home")
    requestAnimationFrame(() => {
      document.getElementById("skills-section")?.scrollIntoView({ behavior: "smooth" })
    })
  }

  function goHelp() {
    setView("home")
    requestAnimationFrame(() => {
      document.getElementById("help-requests-section")?.scrollIntoView({ behavior: "smooth" })
    })
  }

  return (
    <div>
      <Navbar
        user={user}
        onHome={goHome}
        onSkills={goSkills}
        onHelp={goHelp}
        onLogin={() => setView("login")}
        onLogout={handleLogout}
      />

      {view === "login" ? (
        <LoginPage onLogin={handleLogin} onBack={goHome} />
      ) : (
        <div className="container">
          <section className="hero-panel">
            <div className="hero-copy">
              <p className="eyebrow">Student Skill Exchange Platform</p>
              <h1 className="title">SkillBridge</h1>
              <p className="subtitle">
                Connect with students, share what you know, and find peer support inside one simple learning community.
              </p>

              <div className="hero-buttons">
                <button className="hero-btn" onClick={goSkills}>
                  Browse Skills
                </button>
                <button className="hero-btn secondary" onClick={goHelp}>
                  Request Help
                </button>
              </div>
            </div>

            <div className="hero-summary" aria-label="SkillBridge summary">
              <div>
                <span>Skills Shared</span>
                <strong>{skills.length}</strong>
              </div>
              <div>
                <span>Help Requests</span>
                <strong>{helpRequests.length}</strong>
              </div>
              <div>
                <span>Access</span>
                <strong>{user ? "Member" : "Guest"}</strong>
              </div>
            </div>
          </section>

          <section className="quick-info" aria-label="How SkillBridge works">
            <article>
              <span>01</span>
              <h3>Share Skills</h3>
              <p>Add skills you can teach with category, level, and description.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Find Mentors</h3>
              <p>Search available skills and discover students who can guide you.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Request Help</h3>
              <p>Post topics you need support with and allow others to volunteer.</p>
            </article>
          </section>

          <section className="profile-summary" aria-label="Profile summary">
            <div>
              <p className="eyebrow">Profile</p>
              <h2>{user ? `${user}'s Dashboard` : "Guest Dashboard"}</h2>
              <p>
                Login with your name to manage your own skills, requests, and offers.
              </p>
            </div>
            <div className="profile-stats">
              <article>
                <span>My Skills</span>
                <strong>
                  {user
                    ? skills.filter((skill) => skill.student.toLowerCase() === user.toLowerCase()).length
                    : 0}
                </strong>
              </article>
              <article>
                <span>My Requests</span>
                <strong>
                  {user
                    ? helpRequests.filter((request) => request.student.toLowerCase() === user.toLowerCase()).length
                    : 0}
                </strong>
              </article>
              <article>
                <span>Open Requests</span>
                <strong>
                  {helpRequests.filter((request) => (request.status || "Open") === "Open").length}
                </strong>
              </article>
            </div>
          </section>

          <div className="dashboard">
            <div className="card">
              <h3>{skills.length}</h3>
              <p>Skills Shared</p>
            </div>
            <div className="card">
              <h3>{helpRequests.length}</h3>
              <p>Help Requests</p>
            </div>
          </div>

          <p className="stats-line" aria-live="polite">
            {skills.length} skills shared - {helpRequests.length} help requests
          </p>

          <ShareSkillForm onAdd={handleAddSkill} loggedInName={user} />

          <SkillsList
            skills={skills}
            currentUser={user}
            onRemoveSkill={handleRemoveSkill}
            onUpdateSkill={handleUpdateSkill}
          />

          <RequestHelpForm onAdd={handleAddHelpRequest} loggedInName={user} />

          <HelpRequestsList
            requests={helpRequests}
            currentUser={user}
            onRemoveRequest={handleRemoveHelpRequest}
            onUpdateRequest={handleUpdateHelpRequest}
            onOfferHelp={handleOfferHelp}
          />

          <DataBackup
            skills={skills}
            helpRequests={helpRequests}
            user={user}
            onRestore={handleRestoreBackup}
          />

          <footer className="site-footer">
            <p>SkillBridge - Student Skill Exchange Platform</p>
          </footer>
        </div>
      )}
    </div>
  )
}

export default App
