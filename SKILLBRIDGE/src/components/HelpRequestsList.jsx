import { useMemo, useState } from "react"

const categories = ["All", "Programming", "Design", "Communication", "Marketing", "Languages", "Other"]
const statuses = ["Open", "Matched", "Closed"]

function sameStudent(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

function hasOffered(offers, name) {
  if (!name?.trim()) return false
  const n = name.trim().toLowerCase()
  return (offers || []).some((o) => o.trim().toLowerCase() === n)
}

function HelpRequestsList({
  requests,
  currentUser,
  onRemoveRequest,
  onUpdateRequest,
  onOfferHelp,
}) {
  const [search, setSearch] = useState("")
  const [showMineOnly, setShowMineOnly] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const filtered = useMemo(() => {
    let list = requests

    if (showMineOnly && currentUser) {
      list = list.filter((r) => sameStudent(r.student, currentUser))
    }

    if (categoryFilter !== "All") {
      list = list.filter((r) => (r.category || "Other") === categoryFilter)
    }

    if (statusFilter !== "All") {
      list = list.filter((r) => (r.status || "Open") === statusFilter)
    }

    const query = search.trim().toLowerCase()
    if (!query) return list

    return list.filter(
      (r) =>
        r.topic?.toLowerCase().includes(query) ||
        r.student?.toLowerCase().includes(query) ||
        r.category?.toLowerCase().includes(query) ||
        r.message?.toLowerCase().includes(query),
    )
  }, [requests, search, showMineOnly, categoryFilter, statusFilter, currentUser])

  function handleEdit(request) {
    const topic = window.prompt("Edit request topic", request.topic)?.trim()
    if (!topic) return

    const message = window.prompt("Edit request details", request.message || "")

    onUpdateRequest(request.id, {
      topic,
      message: message?.trim() || "",
    })
  }

  return (
    <section id="help-requests-section" className="help-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Support Board</p>
          <h2 className="help-heading">Help Requests</h2>
        </div>
        <span>{filtered.length} requests</span>
      </div>

      <label className="skills-search-label">
        Search Requests
        <input
          className="share-input skills-search-input"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="React, Algebra, Rufina..."
        />
      </label>

      <div className="filters-row">
        <label className="skills-search-label compact-filter">
          Category Filter
          <select
            className="share-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="skills-search-label compact-filter">
          Status Filter
          <select
            className="share-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>

      {currentUser && (
        <label className="filter-mine">
          <input
            type="checkbox"
            checked={showMineOnly}
            onChange={(e) => setShowMineOnly(e.target.checked)}
          />
          Show only my requests
        </label>
      )}

      {filtered.length === 0 ? (
        <p className="skills-empty">No requests match your search.</p>
      ) : (
        <div className="help-grid">
          {filtered.map((req) => {
            const offers = req.offers || []
            const status = req.status || (offers.length > 0 ? "Matched" : "Open")
            const canRemove = currentUser && sameStudent(req.student, currentUser)
            const isOwn = currentUser && sameStudent(req.student, currentUser)
            const volunteered = currentUser && hasOffered(offers, currentUser)

            return (
              <article className="request-card" key={req.id}>
                <div className="card-topline">
                  <span>{req.category || "General"}</span>
                  <span className={status === "Matched" ? "status-chip matched" : `status-chip ${status.toLowerCase()}`}>
                    {status}
                  </span>
                </div>
                <h3>{req.topic}</h3>
                <p><strong>Posted By:</strong> {req.student}</p>

                {req.message && (
                  <p><strong>Details:</strong> {req.message}</p>
                )}

                {offers.length > 0 && (
                  <p><strong>Helpers:</strong> {offers.join(", ")}</p>
                )}

                {currentUser && isOwn && (
                  <div className="owner-tools">
                    <p className="offer-own-hint">This is your request.</p>
                    <label>
                      Request Status
                      <select
                        className="share-select"
                        value={status}
                        onChange={(e) => onUpdateRequest(req.id, { status: e.target.value })}
                      >
                        {statuses.map((statusOption) => (
                          <option key={statusOption} value={statusOption}>
                            {statusOption}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                )}

                {currentUser && !isOwn && !volunteered && (
                  <button
                    type="button"
                    className="offer-help-button"
                    onClick={() => onOfferHelp(req.id)}
                  >
                    I Can Help
                  </button>
                )}

                {currentUser && volunteered && (
                  <p className="offer-help-done">You offered help</p>
                )}

                {!currentUser && (
                  <p className="offer-help-login-hint">Login to offer help.</p>
                )}

                {canRemove && (
                  <div className="card-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(req)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="skill-remove"
                      onClick={() => onRemoveRequest(req.id)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default HelpRequestsList
