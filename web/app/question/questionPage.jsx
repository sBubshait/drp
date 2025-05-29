import {useEffect, useState} from 'react';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import QuestionContent from "../components/site_layout/questionContent.jsx";

export function QuestionPage() {
  const [fetchedQuestion, setFetchedQuestion] = useState();

  useEffect(() => {
    console.log("hello !!!");
    fetch('http://localhost:8080/getFeed')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFetchedQuestion(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);  // Run once on page load, subsequent ones use a specific id

  const handleOptionClick = (option) => {
    alert(`Selected option: ${option}`);
  };

  return (
    <div className="w-full bg-gray-200 flex flex-col">
      <QuestionHeader questionNumber={1} totalQuestions={5} taskType={"Question"} />
      <QuestionContent content={fetchedQuestion?.content || null} />
    </div>
  );
}
