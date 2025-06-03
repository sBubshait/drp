import { useState } from 'react';
import SectionHeader from '../components/common/sectionHeader';
import ContextBox from '../components/common/contextBox';
import PinkContainer from '../components/discussions/PinkContainer';
import WriteSection from '../components/discussions/WriteSection';

export function DiscussionsPage() {
    const [userInput, setUserInput] = useState('');

    const handleSubmit = () => {
        if (userInput.trim().length === 0) {
            alert('Please share your thoughts before unlocking the discussion!');
            return;
        }

        alert('Thank you for sharing! The discussion is now unlocked.');
        setUserInput('');
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
        <div className="w-full h-screen bg-gray-200 flex flex-col">
            <SectionHeader sectionNumber={3} totalSections={4} sectionType="Community Thoughts" />

            <div className="flex-1 p-5 flex flex-col gap-4">

                <ContextBox text="Trump wants to cut funding to universities that teach critical race theory." />

                <PinkContainer text="Should the government use funding to control what universities teach and believe?" />

                <WriteSection userInput={userInput} setUserInput={setUserInput} handleSubmit={handleSubmit} />

                <ParticipationSection avatarLetters={avatarLetters} avatarColors={avatarColors} />

                <LockedDiscussionSection />

            </div>
        </div>
    );
}

function ParticipationSection({ avatarLetters, avatarColors }) {
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
                <span className="text-cyan-600 font-bold">12+</span> People shared their thoughts!
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