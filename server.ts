import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Skill Matching Logic
  const categories = {
    Technology: {
      skills: ["problem solving", "analytical thinking", "logical reasoning", "programming", "data analysis", "coding", "software", "tech"],
      recommendations: ["Software Development Projects", "Data Analysis Internships", "Cloud Computing Workshops"],
      insight: "Your logical and analytical approach makes you a natural fit for technical problem-solving and systems development."
    },
    Design: {
      skills: ["creativity", "visual thinking", "design thinking", "illustration", "user interface design", "ui", "ux", "graphic design", "art"],
      recommendations: ["UI/UX Design Projects", "Graphic Design Opportunities", "Creative Direction Internships"],
      insight: "Your creative vision and ability to think visually allow you to excel in crafting intuitive and aesthetic experiences."
    },
    Communication: {
      skills: ["writing", "storytelling", "public speaking", "communication", "content creation", "presentation", "journalism", "editing"],
      recommendations: ["Content Writing Opportunities", "Public Speaking Clubs", "Media & PR Internships"],
      insight: "Your ability to articulate ideas and connect with audiences is a powerful asset in media and interpersonal domains."
    },
    Business: {
      skills: ["leadership", "organization", "negotiation", "management", "entrepreneurship", "strategy", "finance", "marketing"],
      recommendations: ["Marketing Internships", "Entrepreneurship Programs", "Business Strategy Competitions"],
      insight: "Your organizational skills and strategic mindset position you perfectly for leadership and commercial roles."
    },
    Sports: {
      skills: ["physical fitness", "discipline", "teamwork", "athletic training", "coaching", "stamina", "coordination"],
      recommendations: ["Athletic Training Programs", "Sports Academies", "Team Management Roles"],
      insight: "Your discipline and collaborative spirit are essential for high-performance environments and team-based excellence."
    }
  };

  app.post("/api/match", (req, res) => {
    const { name, skillsInput } = req.body;
    if (!name || !skillsInput) {
      return res.status(400).json({ error: "Name and skills are required" });
    }

    const userSkills = skillsInput.split(",").map((s: string) => s.trim().toLowerCase());
    let scores: Record<string, number> = {};
    
    Object.keys(categories).forEach(cat => {
      scores[cat] = 0;
      const catData = categories[cat as keyof typeof categories];
      userSkills.forEach(skill => {
        if (catData.skills.includes(skill)) {
          scores[cat]++;
        }
      });
    });

    // Find strongest category
    let strongestCategory = Object.keys(scores).reduce((a, b) => scores[a] >= scores[b] ? a : b);
    
    // Fallback if no matches
    if (scores[strongestCategory] === 0) {
      strongestCategory = "General Growth";
      res.json({
        name,
        userSkills,
        strongestCategory,
        recommendations: ["Personal Development Workshops", "General Internship Programs"],
        insight: "You have a diverse set of skills! Exploring various domains will help you find your specific niche."
      });
    } else {
      const result = categories[strongestCategory as keyof typeof categories];
      res.json({
        name,
        userSkills,
        strongestCategory,
        recommendations: result.recommendations,
        insight: result.insight
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
