import {useEffect, useState} from 'react';

export default function PollResults({ content }) {
  const { options, responseCounts, totalResponses } = content;
  const [animate, setAnimate] = useState(false);
  
  const getPercentage = (count) => {
    if (totalResponses === 0) return 0;
    return Math.round((count / totalResponses) * 100);
  };

  // Auto-animate on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-3 px-6">
      {options.map((option, index) => {
        const percentage = getPercentage(responseCounts[index]);
        return (
          <div key={index} className="relative">
            <div 
              className="flex items-center rounded-lg overflow-hidden relative"
              style={{ backgroundColor: '#B18293' }}
            >
              {/* Background fill that represents the percentage */}
              <div 
                className="absolute left-0 top-0 h-full rounded-lg transition-all duration-1000 ease-out"
                style={{ 
                  backgroundColor: '#F08FB3',
                  width: animate ? `${percentage}%` : '0%'
                }}
              />
              
              {/* Percentage label - always visible on the left */}
              <div className="relative z-10 flex items-center justify-center text-black font-bold px-4 py-4 min-w-[60px]">
                {percentage}%
              </div>
              
              {/* Option text */}
              <div className="relative z-10 flex-1 px-4 py-4 text-white font-medium">
                {option}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
