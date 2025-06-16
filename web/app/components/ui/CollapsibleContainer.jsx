import React, { useState, useRef, useEffect } from 'react';

export default function CollapsibleContainer({ title, children, initiallyOpen = false, count = null }) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(initiallyOpen ? 'auto' : 0);
  
  useEffect(() => {
    if (isOpen) {
      const height = contentRef.current.scrollHeight;
      setContentHeight(height);
      
      // After animation completes, set to auto to handle content changes
      const timer = setTimeout(() => {
        setContentHeight('auto');
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      // First set a fixed height to enable animation from auto
      if (contentHeight === 'auto') {
        const height = contentRef.current.scrollHeight;
        setContentHeight(height);
        
        // Force a reflow
        contentRef.current.offsetHeight;
      }
      
      // Then animate to 0
      setTimeout(() => {
        setContentHeight(0);
      }, 10);
    }
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border border-gray-300 rounded-md mb-4 overflow-hidden">
      <div 
        className="bg-gray-200 px-4 py-3 cursor-pointer flex justify-between items-center"
        onClick={toggleOpen}
      >
        <div className="flex items-center">
          <h3 className="font-medium text-gray-700">{title}</h3>
          {count !== null && (
            <span className="ml-2 bg-cyan-600 text-white text-xs px-2 py-1 rounded-full">{count}</span>
          )}
        </div>
        <div className="transform transition-transform duration-200" style={{ 
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
        }}>
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div 
        ref={contentRef}
        className="transition-all duration-300 ease-in-out overflow-hidden bg-white"
        style={{ 
          height: typeof contentHeight === 'number' ? `${contentHeight}px` : contentHeight
        }}
      >
        <div className="divide-y divide-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}