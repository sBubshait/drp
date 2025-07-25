import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import ContextBox from "../common/contextBox.jsx";
import PinkContainer from "../discussions/PinkContainer.jsx";
import WriteSection from "../discussions/WriteSection.jsx";
import ResponseContainer from "../discussions/ResponseContainer.jsx";
import ApiService from '../../services/api.js';

export default function DiscussionContent({ content, interactCallback }) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responses, setResponses] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);
  const [userResponseId, setUserResponseId] = useState(null);
  const navigate = useNavigate();
  
  // Ref to store the polling interval
  const pollingIntervalRef = useRef(null);

  if (!content) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-600">Loading discussion...</p>
      </div>
    );
  }

  const segmentId = content.id;
  const { id, context, prompt, totalResponses } = content;

  // Helper function to compare response arrays
  const responsesAreEqual = (responses1, responses2) => {
    if (responses1.length !== responses2.length) return false;
    
    return responses1.every((response1, index) => {
      const response2 = responses2[index];
      return response1.id === response2.id && 
             response1.content === response2.content &&
             response1.createdAt === response2.createdAt;
    });
  };

  // Function to fetch segment data and update responses if different
  const pollSegmentData = async () => {
    try {
      const segmentData = await ApiService.getSegment(segmentId);
      
      // If this is a discussion segment, fetch the latest responses
      if (segmentData.segment && segmentData.segment.type === 'discussion') {
        const discussionData = await ApiService.getDiscussionResponses(id);
        const newResponses = discussionData.responses || [];
        
        // Only update state if responses have actually changed
        setResponses(currentResponses => {
          if (!responsesAreEqual(currentResponses, newResponses)) {
            return newResponses;
          }
          return currentResponses;
        });
      }
    } catch (error) {
      console.error('Error polling segment data:', error);
      // Don't show error to user for polling failures
    }
  };

  // Start polling when component mounts and stop when it unmounts
  useEffect(() => {
    // Start polling every 250ms
    pollingIntervalRef.current = setInterval(pollSegmentData, 250);

    // Cleanup function to clear interval
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [segmentId, id]); // Restart polling if segmentId or discussion id changes

  // Check localStorage on component mount
  useEffect(() => {
    if (id) {
      const savedResponseId = localStorage.getItem(`discussion_${id}_responseId`);
      if (savedResponseId) {
        setHasSubmitted(true);
        setUserResponseId(savedResponseId);
        fetchResponses(savedResponseId);
      }
    }
  }, [id]);

  const fetchResponses = async (savedResponseId = userResponseId) => {
    setIsLoadingResponses(true);
    try {
      const data = await ApiService.getDiscussionResponses(id);
      setResponses(data.responses);

      // Find and set user's response if it exists
      if (savedResponseId) {
        const userResponse = data.responses.find(response => response.id == savedResponseId);
        if (userResponse) {
          setUserInput(userResponse.content);
        }
      }
    } catch (error) {
      console.error('Error fetching discussion responses:', error);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleSubmit = async () => {
    if (userInput.trim().length == 0) {
      alert('Please share your thoughts before unlocking the discussion!');
      return;
    }

    interactCallback(segmentId);

    setIsSubmitting(true);

    try {
      const response = await ApiService.submitDiscussionResponse(id, userInput);
      const responseId = response.id || response.responseId;

      // Save to localStorage
      localStorage.setItem(`discussion_${id}_responseId`, responseId);

      setHasSubmitted(true);
      setUserResponseId(responseId);
      await fetchResponses();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('There was an error submitting your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditResponse = async () => {
    if (userInput.trim().length == 0) {
      alert('Please share your thoughts before updating!');
      return;
    }

    setIsSubmitting(true);

    try {
      await ApiService.editDiscussionResponse(id, userResponseId, userInput);
      await fetchResponses();
      setHasSubmitted(true);
    } catch (error) {
      console.error('Error editing response:', error);
      alert('There was an error updating your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToEdit = () => {
    setHasSubmitted(false);
  };

  const handleBackToArticle = () => {
    navigate('/article');
  };

  const avatarLetters = ['A', 'M', 'S', 'J', 'R'];
  const avatarColors = [
    'bg-red-500',
    'bg-emerald-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-amber-500'
  ];

  // Check if user has not yet submitted AND there is no existing response
  const showWriteSection = !hasSubmitted && !userResponseId;

  return (
    <div className="h-full flex flex-col relative">
      {/* Context section - fixed height */}
      <div className="flex-shrink-0 p-3">
        <div className="max-h-32 overflow-y-auto">
          <ContextBox text={context} />
        </div>
      </div>

      {/* Prompt section - fixed height */}
      <div className="flex-shrink-0 px-3 mb-3">
        <PinkContainer text={prompt} />
      </div>

      {/* Main content area - takes remaining space */}
      <div className="flex-1 flex flex-col min-h-0 px-3 pb-3">
        {showWriteSection ? (
          <div className="h-full flex flex-col space-y-4">
            {/* Write section - takes all available space */}
            <div className="flex-1 min-h-0">
              <WriteSection
                userInput={userInput}
                setUserInput={setUserInput}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isEditing={false}
              />
            </div>

            {/* Bottom sections - fixed size */}
            <div className="flex-shrink-0 space-y-4">
              <ParticipationSection
                avatarLetters={avatarLetters}
                avatarColors={avatarColors}
                responseCount={totalResponses || 0}
              />

              <LockedDiscussionSection />
            </div>
          </div>
        ) : !hasSubmitted && userResponseId ? (
          // Edit mode - user is editing their existing response
          <div className="h-full flex flex-col space-y-4">
            <div className="flex-1 min-h-0">
              <WriteSection
                userInput={userInput}
                setUserInput={setUserInput}
                handleSubmit={handleEditResponse}
                isSubmitting={isSubmitting}
                isEditing={true}
              />
            </div>

            <div className="flex-shrink-0">
              <button
                onClick={() => setHasSubmitted(true)}
                className="w-full text-cyan-600 hover:text-cyan-700 text-sm font-medium py-2 rounded-md hover:bg-cyan-50 transition-colors"
              >
                ← Back to Discussion
              </button>
            </div>
          </div>
        ) : (
          // Discussion view - showing all responses
          <div className="h-full flex flex-col">
            <div className="flex-shrink-0 flex items-center justify-between mb-3">
              <div className="w-24"></div> {/* Spacer for balance */}
              <div className="text-lg font-semibold text-gray-700 text-center">
                {responses.length + 1} Response{responses.length !== 0 ? 's' : ''}
              </div>
              <button
                onClick={handleBackToEdit}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium px-3 py-1 rounded-md hover:bg-cyan-50 transition-colors whitespace-nowrap"
              >
                Edit Response
              </button>
            </div>

            {isLoadingResponses ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-500 text-sm">Loading responses...</div>
              </div>
            ) : (
              <div className="h-full flex-1 overflow-y-auto no-scrollbar  border border-gray-200 rounded-lg">
                <div className="h-96 space-y-3 p-3" id="responseContainer">
                  {responses
                    .sort((a, b) => {
                      // Put user's response first
                      if (a.id == userResponseId) return -1;
                      if (b.id == userResponseId) return 1;
                      
                      // For other responses, sort in reverse chronological order (newest first)
                      // Convert custom timestamp format [year, month, day, hour, minute, second, nanoseconds] to Date
                      const getTimestamp = (createdAt) => {
                        if (!Array.isArray(createdAt) || createdAt.length < 6) return 0;
                        
                        // Note: JavaScript months are 0-indexed, so subtract 1 from month
                        return new Date(
                          createdAt[0], // year
                          createdAt[1] - 1, // month (subtract 1 for JS Date)
                          createdAt[2], // day
                          createdAt[3], // hour
                          createdAt[4], // minute
                          createdAt[5], // second
                          Math.floor(createdAt[6] / 1000000) // convert nanoseconds to milliseconds
                        ).getTime();
                      };
                      
                      return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
                    })
                    .map((response, index) => (
                      <ResponseContainer
                        key={response.id || index}
                        active={response.id == userResponseId}
                        content={response.content}
                        user={response.id == userResponseId ? "You" : (response.author || `User ${index + 1}`)}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating back button - only show when submitted */}
      {hasSubmitted && (
        <button
          onClick={handleBackToArticle}
          className="fixed bottom-6 right-6 bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full shadow-lg transition-colors z-50"
          aria-label="Back to article"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

function ParticipationSection({ avatarLetters, avatarColors, responseCount }) {
  return (
    <div className="flex items-center justify-center gap-3 bg-white rounded-lg p-4">
      <div className="flex items-center">
        {avatarLetters.map((letter, index) => (
          <div
            key={index}
            className={`w-8 h-8 rounded-full border-2 border-white ${avatarColors[index]} flex items-center justify-center text-white font-semibold text-xs shadow-sm ${index > 0 ? '-ml-1.5' : ''}`}
          >
            {letter}
          </div>
        ))}
      </div>
      <div className="text-md text-gray-600 font-medium">
        <span className="text-cyan-600 font-bold">{responseCount}+</span> People shared their thoughts!
      </div>
    </div>
  );
}

function LockedDiscussionSection() {
  return (
    <div className="text-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
      <div className="text-xl mb-2 opacity-60">🔒</div>
      <div className="text-gray-500 text-md italic">
        Share your perspective to see what others are saying!
      </div>
    </div>
  );
}
