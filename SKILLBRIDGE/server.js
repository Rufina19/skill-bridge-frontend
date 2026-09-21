import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const skills = [];

app.get("/api/skills", (req, res) => {
  res.json(skills);
});

app.post("/api/skills", (req, res) => {
  const skill = req.body;
  skills.push(skill);

  res.status(201).json({
    message: "Skill added successfully",
    skill,
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});