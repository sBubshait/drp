import { useState } from 'react';
import ContextBox from "../question_elements/contextBox.jsx";
import PinkContainer from "../discussions/PinkContainer.jsx";
import WriteSection from "../discussions/WriteSection.jsx";
import ResponseContainer from "../discussions/ResponseContainer.jsx";
import ApiService from '../../services/api.js';

export default function DiscussionContent({ content }) {
  const [userInput, setUserInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responses, setResponses] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);

  if (!content) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-600">Loading discussion...</p>
      </div>
    );
  }

  const { id, context, prompt, totalResponses } = content;

  const fetchResponses = async () => {
    setIsLoadingResponses(true);
    try {
      const data = await ApiService.getDiscussionResponses(id);
      setResponses(data.responses || []);
    } catch (error) {
      console.error('Error fetching discussion responses:', error);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const handleSubmit = async () => {
    if (userInput.trim().length === 0) {
      alert('Please share your thoughts before unlocking the discussion!');
      return;
    }

    setIsSubmitting(true);

    try {
      await ApiService.submitDiscussionResponse(id, userInput);
      setHasSubmitted(true);
      await fetchResponses();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('There was an error submitting your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const avatarLetters = ['A', 'M', 'S', 'J', 'R'];
  const avatarColors = [
    'bg-red-500',
    'bg-emerald-500',
    'bg-blue-500',
    'bg-purple-500',
    'bg-amber-500'
  ];

  return (
    <>
      <div className="flex-1 p-6">
        <ContextBox text={context} />
      </div>

      <div className="px-6 mb-6">
        <PinkContainer text={prompt} />
      </div>

      {!hasSubmitted ? (
        <>
          <div className="px-6 mb-4">
            <WriteSection
              userInput={userInput}
              setUserInput={setUserInput}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="px-6 mb-4">
            <ParticipationSection
              avatarLetters={avatarLetters}
              avatarColors={avatarColors}
              responseCount={totalResponses || 0}
            />
          </div>

          <div className="px-6 mb-6">
            <LockedDiscussionSection />
          </div>
        </>
      ) : (
        <div className="px-6 mb-6">
          <div className="text-xl font-semibold text-gray-700 mb-4 text-center">
            {responses.length + 1} Response{responses.length !== 0 ? 's' : ''}
          </div>

          {isLoadingResponses ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading responses...</div>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto no-scrollbar">
              {userInput && (
                <ResponseContainer 
                  active={true} 
                  content={userInput} 
                  user="You" 
                />
              )}
              {responses.map((response, index) => (
                <ResponseContainer
                  key={response.id || index}
                  content={response.content}
                  user={response.author || `User ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
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