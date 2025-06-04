import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";
import QuestionContent from "../components/site_layout/questionContent.jsx";
import PollContent from "../components/site_layout/pollContent.jsx";

export function QuestionPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [segments, setSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();
  
  // Get article ID from URL params
  const articleId = params.id ? parseInt(params.id, 10) : null;
  
  function capitalise(s) {
    return s && String(s[0]).toUpperCase() + String(s).slice(1);
  }

  // Mock article data to get segments
  const generateMockSegmentsForId = (id) => {
    const articlesSegments = {
      9: [
        {"status":200,"prev":0,"next":2,"articleIndex":1,"content":{"type":"question","id":1,"context":"Solar panel efficiency has improved dramatically over the past decade.","title":"What is the typical efficiency of modern solar panels?","options":["10-15%","15-20%","20-25%","25-30%"],"answer":2,"hasAnswer":true,"correctAnswerFeedback":"Correct! Modern solar panels typically achieve 20-25% efficiency.","wrongAnswerFeedback":"Actually, modern solar panels typically achieve 20-25% efficiency.","generalAnswer":null},"createdAt":"2025-05-29T23:31:56.052484","source":""}
      ],
      10: [
        {"status":200,"prev":0,"next":2,"articleIndex":1,"content":{"type":"question","id":1,"context":"Trump wants to cut all federal grant money to that was supposed to go for scientific and engineering research at Harvard. He called  Harvard as 'radicalised', 'lunatics', and 'troublemakers' who don't deserve taxpayer cash. Instead, they can use the 'ridiculous' endowments they have.","title":"How much do you think Harvard's endowment is actually worth?","options":["$5 Billion","$15 Billion","$35 Billion","$53 Billion"],"answer":null,"hasAnswer":true,"correctAnswerFeedback":"Yes, you got it! It was indeed worth $53 Billion.. literally wealthier than half of the countries on earth!\r\n\r\nDoes this give you any thoughts?","wrongAnswerFeedback":"It's actually worth $53 Billion.. literally wealthier than half of the countries on earth!\r\n\r\nDoes this give you any thoughts?","generalAnswer":null},"createdAt":"2025-05-29T23:31:56.052484","source":""},
        {"status":200,"prev":1,"next":3,"articleIndex":1,"content":{"type":"poll","id":2,"context":"Citing the combating of anti-semitism within Harvard, the Trump administration banned the university's ability to admit international students until it handed over 'any and all audio or video footage of any protest activity involving a non-immigrant student on campus in the last 5 years'.","title":"Do you think this request is too far?","options":["It was necessary","It was reasonable","It overstepped","It's an abuse of power"],"responseCounts":[20,27,61,15],"totalResponses":123,"allowsMultipleSelection":false,"type":"poll"},"createdAt":"2025-05-29T23:32:42.879658","source":""},
      ],
      11: [
        {"status":200,"prev":0,"next":2,"articleIndex":1,"content":{"type":"poll","id":1,"context":"Electric vehicle adoption is accelerating worldwide.","title":"What's the biggest barrier to EV adoption?","options":["Cost","Charging infrastructure","Range anxiety","Lack of models"],"responseCounts":[45,67,89,23],"totalResponses":224,"allowsMultipleSelection":false,"type":"poll"},"createdAt":"2025-05-29T23:32:42.879658","source":""}
      ]
    };

    return articlesSegments[id] || [
      {"status":200,"prev":0,"next":2,"articleIndex":1,"content":{"type":"question","id":1,"context":`This is a question for article ${id}.`,"title":`Question about article ${id}?`,"options":["Option A","Option B","Option C","Option D"],"answer":0,"hasAnswer":true,"correctAnswerFeedback":"Correct!","wrongAnswerFeedback":"Not quite right.","generalAnswer":null},"createdAt":"2025-05-29T23:31:56.052484","source":""}
    ];
  };

  // Fetch segments for the article
  const fetchSegments = async (id) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`https://api.saleh.host/getArticle?id=${id}`);
      // const data = await response.json();
      // setSegments(data.segments || []);
      
      console.log(`Fetching segments for article ${id}`);
      
      // Simulate API call with setTimeout
      setTimeout(() => {
        const articleSegments = generateMockSegmentsForId(id);
        setSegments(articleSegments);
        setLoading(false);
      }, 100);
    } catch (error) {
      console.error('Error fetching segments:', error);
      setSegments([]);
      setLoading(false);
    }
  };

  // Navigation functions
  const goToNext = () => {
    if (currentIndex < segments.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      // Navigate back to article page if on first question
      navigate(`/articles/${articleId}`);
    }
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: goToNext,        // Swipe left to go to next question
    onSwipedRight: goToPrev,       // Swipe right to go to previous question or back to article
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true // This enables mouse dragging for testing on desktop
  });

  // Fetch segments when articleId changes
  useEffect(() => {
    if (articleId) {
      fetchSegments(articleId);
      setCurrentIndex(0);
    }
  }, [articleId]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (loading || segments.length === 0) return;

      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrev();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading, segments.length, currentIndex]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading questions...</p>
        {articleId && (
          <p className="text-gray-500 text-sm mt-2">Loading questions for article {articleId}...</p>
        )}
      </div>
    );
  }

  // No article ID
  if (!articleId) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">No article ID provided.</p>
        <button 
          onClick={() => navigate('/articles/10/questions')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Default Article Questions
        </button>
      </div>
    );
  }

  // No segments available
  if (segments.length === 0) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">No questions found for this article.</p>
        <button 
          onClick={() => navigate(`/articles/${articleId}`)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Article
        </button>
      </div>
    );
  }

  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col">
      <QuestionHeader
        questionNumber={currentIndex + 1}
        totalQuestions={segments.length}
        taskType={capitalise(segments[currentIndex]?.content.type)}
      />
      
      {/* Render based on content type */}
      {(segments[currentIndex]?.content.type === "question") && (
        <QuestionContent content={segments[currentIndex]?.content || {}} />
      )}
      {(segments[currentIndex]?.content.type === "poll") && (
        <PollContent content={segments[currentIndex]?.content || {}} />
      )}
    </div>
  );
}
