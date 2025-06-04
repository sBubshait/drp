import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import SectionHeader from '../components/common/sectionHeader';
import ContextBox from '../components/common/contextBox';
import PinkContainer from '../components/discussions/PinkContainer';
import WriteSection from '../components/discussions/WriteSection';
import { API_URL } from '../config';

export function DiscussionsPage() {
    const [userInput, setUserInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [discussionData, setDiscussionData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [responses, setResponses] = useState([]);
    const navigate = useNavigate();

    const discussionId = 4; // Hardcoded now

    useEffect(() => {
        fetchDiscussionData();
    }, []);

    const fetchDiscussionData = async () => {
        try {
            const response = await fetch(`${API_URL}/discussions/responses?discussionId=4`);

            if (!response.ok) {
                throw new Error('Failed to fetch discussion data');
            }

            const data = await response.json();
            if (data.status != 200) {
                useNavigate('/?error=Discussion not found');
                return;
            }
            setDiscussionData(data.discussion);
            setResponses(data.responses || []);
        } catch (error) {
            console.error('Error fetching discussion data:', error);
            // Could show error state or use fallback data
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (userInput.trim().length === 0) {
            alert('Please share your thoughts before unlocking the discussion!');
            return;
        }

        setIsSubmitting(true);

        try {
            // Submit the response
            const respondResponse = await fetch(`${API_URL}/discussions/respond`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    discussionId: 4,
                    content: userInput.trim()
                })
            });

            if (!respondResponse.ok) {
                throw new Error('Failed to submit response');
            }

            // Navigate to results page with the data
            navigate('/discussions/results', {
                state: {
                    userResponse: userInput.trim(),
                    discussionData,
                    responses: responses || [],
                    discussionId
                }
            });

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

    if (isLoading) {
        return (
            <div className="w-full h-screen bg-gray-200 flex flex-col">
                <SectionHeader sectionNumber={3} totalSections={4} sectionType="Community Thoughts" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">Loading discussion...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-gray-200 flex flex-col">
            <SectionHeader sectionNumber={3} totalSections={4} sectionType="Community Thoughts" />

            <div className="flex-1 p-5 flex flex-col gap-4">

                <ContextBox text={discussionData?.context || "Loading context..."} />

                <PinkContainer text={discussionData?.prompt || "Loading prompt..."} />

                <WriteSection
                    userInput={userInput}
                    setUserInput={setUserInput}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                />

                <ParticipationSection
                    avatarLetters={avatarLetters}
                    avatarColors={avatarColors}
                    responseCount={discussionData?.totalResponses || 0}
                />

                <LockedDiscussionSection />

            </div>
        </div>
    );
}

function ParticipationSection({ avatarLetters, avatarColors, responseCount }) {
    return (
        <div className="flex items-center justify-center gap-3 bg-white rounded-lg p-4 mb-4">
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
    )
}

function LockedDiscussionSection() {
    return (
        <div className="text-center p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-xl mb-2 opacity-60">🔒</div>
            <div className="text-gray-500 text-md italic">
                Share your perspective to see what others are saying!
            </div>
        </div>
    )
}