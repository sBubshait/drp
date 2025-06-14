import { useEffect, useRef, useState } from "react";
import { getCoords } from "./feedScrollController";
import "./feed.css";

export default function Feed() {

  const offset = useRef({x: 0, y: 0});

  const feedContent =
    getCoords({x:0, y:0}).filter((coords) => coords.virtualCoords).map((coords) => 
      <div id={`${coords.virtualCoords.x}-${coords.virtualCoords.y}`} className={`block col-start-${coords.trueCoords.x} row-start-${coords.trueCoords.y}`}> 
        {`x: ${coords.trueCoords.x} y: ${coords.trueCoords.y}`}
    </div>
    );

  useEffect(() => {
    document.getElementById("0-0").scrollIntoView();
  })

  return(
    <div className="scroll-container" id="grid" onScroll={ (e) => {
      const container = e.currentTarget;
      clearTimeout(container._scrollTimeout);
      container._scrollTimeout = setTimeout(() => {
        const col = Math.round(container.scrollLeft / container.offsetWidth);
        const row = Math.round(container.scrollTop / container.offsetHeight);

        let changed = false;

        if (col === 0 && false) {
          offset.current.x--;
          changed = true;
        } else if (col === 2) {
          offset.current.x++;
          changed = true;
        }

        if (row === 0 && false) {
          offset.current.y--;
          changed = true;
        } else if (row === 2) {
          offset.current.y++;
          changed = true;
        }

        if (changed) {
          console.log(offset.current);
          // updateBlocks();
          // resetScroll();
        }
      }, 80); // debounce
    }}>
      {feedContent}
    </div>
  );
}
