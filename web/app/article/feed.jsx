import { useRef, useEffect, useState } from "react";
import { getCoords, getId, resetScroll } from "./feedScrollController";
import "./feed.css";

export default function Feed() {

  const [offset, setOffset] = useState({x: 0, y: 0});
  const fetchedPages = useRef(new Map())

  // Manage feed content
  const genFeedContent = (virtualCoords) => {
   return <div className="block"> {`x: ${virtualCoords.x} y: ${virtualCoords.y}`} </div>
  }

  const feedContent =
    getCoords(offset).filter((coords) => coords.virtualCoords).reduce((content, coords) => {
      
      const id = getId(coords);

      const cache = fetchedPages.current.get(id);
      const data = cache ? cache : genFeedContent(coords.virtualCoords);
      fetchedPages.current.set(id, data);

      content.set(id,
      <div key={id} id={`${coords.trueCoords.x}-${coords.trueCoords.y}`} className={`col-start-${coords.trueCoords.x + 1} row-start-${coords.trueCoords.y + 1}`}> 
        {data}
      </div>
      )
      
      return content;
    }, new Map())

  // On load
  useEffect(() => {
    try {
      document.getElementById("4-4").scrollIntoView();
    } catch (e) {}
  })

  return(
    <div className="scroll-container" id="grid" onScroll={ (e) => {
      const container = e.currentTarget;
      clearTimeout(container._scrollTimeout);
      container._scrollTimeout = setTimeout(() => {
        const col = Math.round(container.scrollLeft / container.offsetWidth);
        const row = Math.round(container.scrollTop / container.offsetHeight);

        if (col != 4 || row != 4) {
          setOffset({x: offset.x + col - 4, y: offset.y + row - 4});
          //updateBlocks();
        }
      }, 80); // debounce
    }}>
      {[...feedContent.values()]}
    </div>
  );
}
