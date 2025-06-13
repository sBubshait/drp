import React, { useEffect, useRef, useState } from "react";

const Digit = ({ digit, containerSize, digitSize}) => {
  const numbers = Array.from({ length: 10 }, (_, i) => i);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.style.transition = 'transform 0.5s ease-in-out';
      container.style.transform = `translateY(-${digit * digitSize}em)`;
    }
  }, [digit]);

  return (
    <div className={`overflow-hidden h-${containerSize} w-max inline-block`}>
      <div ref={containerRef} className="flex flex-col">
        {numbers.map((n) => (
          <div
            key={n}
            className={`h-${containerSize} w-${containerSize} flex items-center justify-center text-[6em] font-bold text-black leading-tight`}
          >
            {n}
          </div>
        ))}
      </div>
    </div>
  );
};

const Odometer = ({ value, containerSize, digitSize }) => {
  const [digits, setDigits] = useState([]);
  
  useEffect(() => {
    const str = value.toString().padStart(1, "0");
    setDigits(str.split("").map(Number));
  }, [value]);

  return (
    <div className="absolute pb-50 space-x-1">
      {digits.map((digit, i) => (
        <Digit key={i} digit={digit} containerSize={containerSize} digitSize={digitSize}/>
      ))}
    </div>
  );
};

export default Odometer;
