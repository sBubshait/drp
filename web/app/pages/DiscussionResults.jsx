import { useState } from 'react';
import SectionHeader from '../components/common/sectionHeader';
import ContextBox from '../components/common/contextBox';
import PinkContainer from '../components/discussions/PinkContainer';
import WriteSection from '../components/discussions/WriteSection';
import ResponseContainer from '../components/discussions/ResponseContainer';

export function DiscussionResultsPage() {
    // Mock data - in real app this would come from props or API
    const userResponse = "I think that... and this is because.... but I disagree with the idea that.....";

    const otherResponses = [
        {
            id: 1,
            text: "But I feel like... and that means... I'm not sure about... because of...",
            user: "user2"
        },
        {
            id: 2,
            text: "I think that... and this is because... but I disagree with the idea that...",
            user: "user3"
        },
        {
            id: 3,
            text: "Actually, I believe the opposite because... when you consider... it becomes clear that...",
            user: "user4"
        },
        {
            id: 4,
            text: "This is a complex issue that requires... we need to think about... from multiple perspectives...",
            user: "user5"
        },
        {
            id: 5,
            text: "My experience has shown me that... which is why I think... but I understand others might...",
            user: "user6"
        }
    ];

    return (
        <div className="w-full h-screen bg-gray-200 flex flex-col">
            <SectionHeader sectionNumber={3} totalSections={4} sectionType="Community Thoughts" />

            <div className="flex-1 p-5 flex flex-col gap-4 min-h-0">

                <PinkContainer text="Should the government use funding to control what universities teach and believe?" />

                <div className="text-xl font-semibold text-gray-700 mb-2 text-center">
                    12 Responses..
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-5 min-h-0 no-scrollbar">
                    <ResponseContainer active={true} response={{ text: userResponse, user: "You" }} />
                    {otherResponses.map((response, index) => (
                        <ResponseContainer key={response.id} response={response} />
                    ))}
                </div>
            </div>
        </div>
    );
}