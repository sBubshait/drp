import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("question", "routes/question.jsx"),
  route("summary", "routes/summary.jsx"),
];
