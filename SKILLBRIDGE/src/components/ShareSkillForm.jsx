import { useEffect, useState } from "react";

const levels = ["Beginner", "Intermediate", "Advanced"];

const categories = [
  "Programming",
  "Design",
  "Communication",
  "Marketing",
  "Languages",
  "Other",
];

function ShareSkillForm({ onAdd, loggedInName }) {
  const [student, setStudent] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [category, setCategory] = useState("Programming");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setStudent(loggedInName?.trim() || "");
  }, [loggedInName]);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmedStudent = student.trim();
    const trimmedName = name.trim();

    if (!trimmedStudent || !trimmedName) {
      setMessage("Please fill all required fields.");
      return;
    }

    const skillData = {
      id: crypto.randomUUID(),
      name: trimmedName,
      student: trimmedStudent,
      category,
      level,
      description: description.trim(),
    };

    try {
      const response = await fetch("http://localhost:5000/api/skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(skillData),
      });

      const data = await response.json();
      console.log(data);

      if (onAdd) {
        onAdd(skillData);
      }

      setName("");
      setLevel("Beginner");
      setCategory("Programming");
      setDescription("");
      setMessage("Skill added successfully.");

      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setMessage("Error saving skill.");
    }
  }

  return (
    <form className="share-form" onSubmit={handleSubmit}>
      <p className="eyebrow">Contribute</p>
      <h2 className="share-form-title">Share Your Skill</h2>
      <p className="share-form-hint">
        Add a skill you can teach and help classmates learn from your knowledge.
      </p>

      {message && (
        <p
          className={
            message.includes("Please") || message.includes("Error")
              ? "error-message"
              : "success-message"
          }
        >
          {message}
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
        Skill Name
        <input
          className="share-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Python, React, Photoshop..."
        />
      </label>

      <div className="form-grid">
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
          Level
          <select
            className="share-select"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="share-label">
        Description
        <textarea
          className="share-textarea"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you can teach..."
        />
      </label>

      <button className="share-button" type="submit">
        Add Skill
      </button>
    </form>
  );
}

export default ShareSkillForm;