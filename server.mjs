
import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AskSearch backend is running!");
});

app.post("/search", (req, res) => {
  const question = req.body.question;

  if (!question || typeof question !== "string") {
    return res.status(400).json({
      answer: "Please enter a question."
    });
  }

  res.json({
    answer: "Your backend received this question: " + question
  });
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log("AskSearch server is running on port " + port);
});
