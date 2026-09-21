import { useMemo, useState } from "react"

const categories = ["All", "Programming", "Design", "Communication", "Marketing", "Languages", "Other"]

function sameStudent(a, b) {
  return a.trim().toLowerCase() === b.trim().toLowerCase()
}

function SkillsList({ skills, currentUser, onRemoveSkill, onUpdateSkill }) {
  const [search, setSearch] = useState("")
  const [showMineOnly, setShowMineOnly] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("All")

  const filteredSkills = useMemo(() => {
    let list = skills

    if (showMineOnly && currentUser) {
      list = list.filter((skill) => sameStudent(skill.student, currentUser))
    }

    if (categoryFilter !== "All") {
      list = list.filter((skill) => (skill.category || "Other") === categoryFilter)
    }

    const query = search.trim().toLowerCase()
    if (!query) return list

    return list.filter(
      (skill) =>
        skill.name?.toLowerCase().includes(query) ||
        skill.student?.toLowerCase().includes(query) ||
        skill.level?.toLowerCase().includes(query) ||
        skill.category?.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query),
    )
  }, [skills, search, showMineOnly, categoryFilter, currentUser])

  function handleEdit(skill) {
    const name = window.prompt("Edit skill name", skill.name)?.trim()
    if (!name) return

    const description = window.prompt(
      "Edit description",
      skill.description || "",
    )

    onUpdateSkill(skill.id, {
      name,
      description: description?.trim() || "",
    })
  }

  return (
    <section id="skills-section" className="skills-section">
      <div className="section-header">
        <div>
          <p className="eyebrow">Directory</p>
          <h2 className="skills-heading">Skills Shared By Students</h2>
        </div>
        <span>{filteredSkills.length} results</span>
      </div>

      <label className="skills-search-label">
        Search Skills
        <input
          className="share-input skills-search-input"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Python, Design, Rufina..."
        />
      </label>

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

      {currentUser && (
        <label className="filter-mine">
          <input
            type="checkbox"
            checked={showMineOnly}
            onChange={(e) => setShowMineOnly(e.target.checked)}
          />
          Show only my skills
        </label>
      )}

      {filteredSkills.length === 0 ? (
        <p className="skills-empty">No skills match your search.</p>
      ) : (
        <div className="skills-grid">
          {filteredSkills.map((skill) => {
            const canRemove = currentUser && sameStudent(skill.student, currentUser)

            return (
              <article className="skill-card" key={skill.id}>
                <div className="card-topline">
                  <span>{skill.category || "General"}</span>
                  <span className="skill-level">{skill.level}</span>
                </div>
                <h3>{skill.name}</h3>
                <p><strong>Shared By:</strong> {skill.student}</p>
                <p><strong>Level:</strong> {skill.level}</p>

                {skill.description && (
                  <p><strong>Description:</strong> {skill.description}</p>
                )}

                {canRemove && (
                  <div className="card-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEdit(skill)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="skill-remove"
                      onClick={() => onRemoveSkill(skill.id)}
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

export default SkillsList
