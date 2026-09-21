import { useEffect, useState } from "react"

const categories = [
  "Programming",
  "Design",
  "Communication",
  "Marketing",
  "Languages",
  "Other",
]

function RequestHelpForm({ onAdd, loggedInName }) {
  const [student, setStudent] = useState("")
  const [topic, setTopic] = useState("")
  const [category, setCategory] = useState("Programming")
  const [message, setMessage] = useState("")
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    setStudent(loggedInName?.trim() || "")
  }, [loggedInName])

  function handleSubmit(e) {
    e.preventDefault()

    const trimmedStudent = student.trim()
    const trimmedTopic = topic.trim()

    if (!trimmedStudent || !trimmedTopic) {
      setFeedback("Please fill all required fields.")
      return
    }

    onAdd({
      id: crypto.randomUUID(),
      student: trimmedStudent,
      topic: trimmedTopic,
      category,
      message: message.trim(),
      offers: [],
      status: "Open",
    })

    setTopic("")
    setMessage("")
    setCategory("Programming")
    setFeedback("Help request posted successfully.")

    setTimeout(() => setFeedback(""), 3000)
  }

  return (
    <form className="share-form help-form" onSubmit={handleSubmit}>
      <p className="eyebrow">Ask</p>
      <h2 className="share-form-title">I Need Help With...</h2>
      <p className="share-form-hint">
        Post a topic and connect with students who can guide you.
      </p>

      {feedback && (
        <p className={feedback.includes("Please") ? "error-message" : "success-message"}>
          {feedback}
        </p>
      )}

      <label className="share-label">
        Your Name
        <input
          className="share-input"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
          placeholder="Enter your name"
        />
      </label>

      <label className="share-label">
        Topic
        <input
          className="share-input"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="React, Figma, Algebra..."
        />
      </label>

      <label className="share-label">
        Category
        <select
          className="share-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </label>

      <label className="share-label">
        Additional Details
        <textarea
          className="share-textarea"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe exactly what help you need..."
        />
      </label>

      <button className="share-button help-submit" type="submit">
        Post Request
      </button>
    </form>
  )
}

export default RequestHelpForm
