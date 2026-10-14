
import express from "express";

const app = express();
app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.send("AskSearch AI backend is running!");
});

app.post("/search", async (req, res) => {
  try {
    const question = req.body?.question;

    if (typeof question !== "string" ||
        !question.trim() ||
        question.length > 2000) {
      return res.status(400).json({
        answer: "Please enter a question under 2,000 characters."
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text:
                "You are AskSearch, a helpful search assistant. " +
                "Answer clearly and accurately. If you are unsure " +
                "about current information, say so. Do not invent sources.\n\n" +
                question.trim()
            }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini request failed:", response.status);
      return res.status(502).json({
        answer: "The AI service could not answer. Please try again."
      });
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("\n")
      .trim();

    res.json({
      answer: answer || "No answer returned. Please try again."
    });
  } catch (error) {
    console.error("Search request failed.");
    res.status(500).json({
      answer: "Something went wrong. Please try again."
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("AskSearch AI backend is running on port " + port);
});
