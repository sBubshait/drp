import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("question", "routes/question.jsx"),
  route("article", "routes/article.jsx"),
  route("articles/:id", "routes/article.$id.jsx"),
  route("articles/:id/questions", "routes/article.$id.questions.jsx"),
  route("discussions", "routes/discussions.jsx"),
  route("discussions/results", "pages/DiscussionResults.jsx")
];
