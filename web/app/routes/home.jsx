import { useState } from "react";
import { ArticlePage } from "../article/articlePage";
import TutorialPage from "../pages/tutorialPage";

export function meta() {
  return [
    { title: "Article Summary - Climate Change" },
    { name: "description", content: "Read about climate change and test your understanding" },
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
    <ArticlePage />
  );
}

