import { useState } from "react";
import { ArticlePageRewrite } from "../pages/articlePageRewrite";
import TutorialPage from "../pages/tutorialPage";

export function meta() {
  return [
    { title: "Article Summary" },
    { name: "description", content: "Read articles and test your understanding" },
  ];
}

export default function Home() {
  const [showTutorial, setShowTutorial] = useState(true);

  const handleSwipeUp = () => {
    setShowTutorial(false);
  };

  return showTutorial ? (
    <TutorialPage onSwipeUp={handleSwipeUp} />
  ) : (
    <ArticlePageRewrite />
  );
}

