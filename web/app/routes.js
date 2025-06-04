import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("question", "routes/question.jsx"),
  route("article", "routes/article.jsx"),
  route("article/:id/questions", "routes/article.$id.questions.jsx")
];
