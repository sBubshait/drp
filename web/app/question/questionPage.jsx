import {useEffect, useState} from 'react';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import QuestionContent from "../components/site_layout/questionContent.jsx";

export function QuestionPage() {
  const [fetchedQuestion, setFetchedQuestion] = useState();
  function capitalise(s)
  {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }

  useEffect(() => {
    fetch('http://drp-api.saleh.host/getFeed')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFetchedQuestion(data);
        console.log(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []);  // Run once on page load, subsequent ones use a specific id

  const handleOptionClick = (option) => {
    alert(`Selected option: ${option}`);
  };

  //TODO: Handle loading data time rather than just potential nulls
return (
  <div className="w-full bg-gray-200 flex flex-col">
    <QuestionHeader
      questionNumber={fetchedQuestion?.content.id}
      totalQuestions={fetchedQuestion?.articleIndex}
      taskType={capitalise(fetchedQuestion?.content.type)}
    />

    {/* TODO: Handle polls */}
    {(fetchedQuestion?.content.type === "question") && (
      <QuestionContent content={fetchedQuestion?.content || {}} />
    )}
  </div>
);
}
