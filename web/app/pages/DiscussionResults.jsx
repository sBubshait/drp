import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import SectionHeader from '../components/common/sectionHeader';
import PinkContainer from '../components/discussions/PinkContainer';
import ResponseContainer from '../components/discussions/ResponseContainer';

export default function DiscussionResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [responses, setResponses] = useState([]);
    const [userResponse, setUserResponse] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if we have data from navigation
        if (location.state) {
            const { userResponse: navUserResponse, responses: navResponses } = location.state;
            console.log('Navigation state:', location.state, responses);
            setUserResponse(navUserResponse || '');
            setResponses(navResponses || []);
            setIsLoading(false);
        } else {
            // If no navigation state, fetch data directly (for direct page access)
            fetchResponses();
        }
    }, [location.state]);

    const fetchResponses = async () => {
        try {
            const response = await fetch('/discussion/responses?discussionId=4');

            if (!response.ok) {
                throw new Error('Failed to fetch responses');
            }

            const data = await response.json();
            setResponses(data);
        } catch (error) {
            console.error('Error fetching responses:', error);
            // Could show an error state or redirect back
            navigate('/discussions');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen bg-gray-200 flex flex-col">
                <SectionHeader sectionNumber={3} totalSections={4} sectionType="Community Thoughts" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-gray-500">Loading responses...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-screen bg-gray-200 flex flex-col">
            <SectionHeader sectionNumber={3} totalSections={4} sectionType="Community Thoughts" />

            <div className="flex-1 p-5 flex flex-col gap-4 min-h-0">

                <PinkContainer text="Should the government use funding to control what universities teach and believe?" />

                <div className="text-xl font-semibold text-gray-700 mb-2 text-center">
                    {responses.length + 1} Response{responses.length !== 0 ? 's' : ''}..
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-5 min-h-0 no-scrollbar">
                    {userResponse && (
                        <ResponseContainer active={true} content={userResponse} user="You" />
                    )}
                    {responses.map((response, index) => (
                        <ResponseContainer
                            key={response.id || index}
                            content={response.content}
                            user={response.author || `User ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}