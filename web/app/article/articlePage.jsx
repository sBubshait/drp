import { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useNavigate, useLocation } from 'react-router';
import QuestionHeader from "../components/question_elements/questionHeader.jsx";

export function ArticlePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fetchedArticle, setFetchedArticle] = useState();

  // Get article ID from navigation state (from question page) or use default
  const requestedArticleId = location.state?.articleId || null;

  // Mock article data - replace with actual API call later
  const mockArticleData = {
    id: 10,
    title: "Understanding Climate Change",
    body: `Climate change refers to long-term shifts in global or regional climate patterns. Since the mid-20th century, scientists have observed unprecedented changes in Earth's climate system, primarily attributed to increased levels of greenhouse gases in the atmosphere.

The primary driver of recent climate change is human activity, particularly the burning of fossil fuels such as coal, oil, and natural gas. These activities release carbon dioxide and other greenhouse gases into the atmosphere, creating a "greenhouse effect" that traps heat and warms the planet.

The effects of climate change are far-reaching and include rising global temperatures, melting ice caps and glaciers, rising sea levels, and more frequent extreme weather events such as hurricanes, droughts, and heatwaves.

Addressing climate change requires global cooperation and action on multiple fronts, including transitioning to renewable energy sources, improving energy efficiency, protecting and restoring natural ecosystems, and developing new technologies to reduce greenhouse gas emissions.`,
    prev: 9,    // Previous article ID
    next: 11,    // Next article ID
    segments: [
      {"status":200,"prev":0,"next":2,"articleIndex":1,"content":{"type":"question","id":1,"context":"Trump wants to cut all federal grant money to that was supposed to go for scientific and engineering research at Harvard. He called  Harvard as 'radicalised', 'lunatics', and 'troublemakers' who don't deserve taxpayer cash. Instead, they can use the 'ridiculous' endowments they have.","title":"How much do you think Harvard's endowment is actually worth?","options":["$5 Billion","$15 Billion","$35 Billion","$53 Billion"],"answer":null,"hasAnswer":true,"correctAnswerFeedback":"Yes, you got it! It was indeed worth $53 Billion.. literally wealthier than half of the countries on earth!\r\n\r\nDoes this give you any thoughts?","wrongAnswerFeedback":"It's actually worth $53 Billion.. literally wealthier than half of the countries on earth!\r\n\r\nDoes this give you any thoughts?","generalAnswer":null},"createdAt":"2025-05-29T23:31:56.052484","source":""},
      {"status":200,"prev":1,"next":3,"articleIndex":1,"content":{"type":"poll","id":2,"context":"Citing the combating of anti-semitism within Harvard, the Trump administration banned the university's ability to admit international students until it handed over 'any and all audio or video footage of any protest activity involving a non-immigrant student on campus in the last 5 years'.","title":"Do you think this request is too far?","options":["It was necessary","It was reasonable","It overstepped","It's an abuse of power"],"responseCounts":[20,27,61,15],"totalResponses":123,"allowsMultipleSelection":false,"type":"poll"},"createdAt":"2025-05-29T23:32:42.879658","source":""},
    ]
  };

  // Mock different articles for different IDs
  const generateMockArticleForId = (id) => {
    const articles = {
      9: {
        ...mockArticleData,
        id: 9,
        title: "Renewable Energy Solutions",
        body: "Renewable energy technologies have made significant strides in recent years. Solar and wind power are now cost-competitive with fossil fuels in many markets. The transition to clean energy is accelerating globally, driven by technological improvements, falling costs, and supportive policies.",
        prev: 8,
        next: 10,
        segments: [
          {"status":200,"prev":0,"next":2,"articleIndex":1,"content":{"type":"question","id":1,"context":"Solar panel efficiency has improved dramatically over the past decade.","title":"What is the typical efficiency of modern solar panels?","options":["10-15%","15-20%","20-25%","25-30%"],"answer":2,"hasAnswer":true,"correctAnswerFeedback":"Correct! Modern solar panels typically achieve 20-25% efficiency.","wrongAnswerFeedback":"Actually, modern solar panels typically achieve 20-25% efficiency.","generalAnswer":null},"createdAt":"2025-05-29T23:31:56.052484","source":""}
        ]
      },
      10: mockArticleData,
      11: {
        ...mockArticleData,
        id: 11,
        title: "Future of Transportation",
        body: "Electric vehicles are revolutionizing the transportation sector. With improving battery technology, expanding charging infrastructure, and falling costs, EVs are becoming mainstream. Autonomous driving technology promises to further transform how we move around cities.",
        prev: 10,
        next: 12,
        segments: [
          {"status":200,"prev":0,"next":2,"articleIndex":1,"content":{"type":"poll","id":1,"context":"Electric vehicle adoption is accelerating worldwide.","title":"What's the biggest barrier to EV adoption?","options":["Cost","Charging infrastructure","Range anxiety","Lack of models"],"responseCounts":[45,67,89,23],"totalResponses":224,"allowsMultipleSelection":false,"type":"poll"},"createdAt":"2025-05-29T23:32:42.879658","source":""}
        ]
      }
    };

    return articles[id] || {
      ...mockArticleData,
      id: id,
      title: `Article ${id}`,
      body: `This is the content for article ${id}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      prev: id > 1 ? id - 1 : null,
      next: id + 1,
      segments: [
        {"status":200,"prev":0,"next":2,"articleIndex":1,"content":{"type":"question","id":1,"context":`This is a question for article ${id}.`,"title":`Question about article ${id}?`,"options":["Option A","Option B","Option C","Option D"],"answer":0,"hasAnswer":true,"correctAnswerFeedback":"Correct!","wrongAnswerFeedback":"Not quite right.","generalAnswer":null},"createdAt":"2025-05-29T23:31:56.052484","source":""}
      ]
    };
  };

  // Function to fetch article by ID (currently using mock data)
  const fetchArticle = (id) => {
    // TODO: Replace with actual API call
    // const url = id ? `https://api.saleh.host/getArticle?id=${id}` : 'https://api.saleh.host/getArticle';
    
    console.log(`Fetching article with ID: ${id || 'default'}`);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      const articleData = id ? generateMockArticleForId(id) : mockArticleData;
      setFetchedArticle(articleData);
    }, 100);
  };

  // Navigation functions
  const goToNext = () => {
    if (fetchedArticle?.next) {
      fetchArticle(fetchedArticle.next);
    }
  };

  const goToPrev = () => {
    if (fetchedArticle?.prev) {
      fetchArticle(fetchedArticle.prev);
    }
  };

  // Navigation function for swipe to questions
  const goToQuestions = () => {
    navigate(`/article/${fetchedArticle?.id || 10}/questions`, {
      state: {
        segments: fetchedArticle?.segments || [],
      }
    });
  };

  // Swipe handlers
  const handlers = useSwipeable({
    onSwipedLeft: goToQuestions,     // Swipe left to go to questions
    onSwipedRight: goToPrev,         // Swipe right to go to previous article
    onSwipedUp: goToNext,            // Swipe up to go to next article
    onSwipedDown: goToPrev,          // Swipe down to go to previous article
    swipeDuration: 500,
    preventScrollOnSwipe: true,
    trackMouse: true // This enables mouse dragging for testing on desktop
  });

  // Initial fetch on component mount
  useEffect(() => {
    if (requestedArticleId) {
      // If coming from question page with specific article ID
      console.log(`Loading article ${requestedArticleId} from navigation state`);
      fetchArticle(requestedArticleId);
    } else {
      // Default behavior - load default article
      fetchArticle(); // No ID parameter for initial load
    }
  }, [requestedArticleId]);

  // Clear navigation state after using it to prevent issues on refresh
  useEffect(() => {
    if (requestedArticleId && fetchedArticle) {
      // Replace the current history entry to clear the state
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [requestedArticleId, fetchedArticle]);

  // Keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!fetchedArticle) return;

      if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        goToPrev();
      } else if (event.key === 'Enter') {
        goToQuestions();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fetchedArticle]);

  if (!fetchedArticle) {
    return (
      <div className="w-full bg-gray-200 flex flex-col min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading article...</p>
        {requestedArticleId && (
          <p className="text-gray-500 text-sm mt-2">Loading article {requestedArticleId}...</p>
        )}
      </div>
    );
  }

  return (
    <div {...handlers} className="w-full bg-gray-200 flex flex-col min-h-screen">
      <QuestionHeader
        questionNumber={fetchedArticle.id}
        totalQuestions={fetchedArticle.segments.length}
        taskType="Article Summary"
      />
      
      <div className="flex-1 p-6">
        <div className="bg-white rounded-lg shadow-md p-6 h-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {fetchedArticle.title}
          </h1>
          
          <div className="text-gray-700 leading-relaxed space-y-4">
            {fetchedArticle.body.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
              <p className="text-blue-800 font-medium">
                💡 Tip: Swipe left to proceed to questions about this article
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}