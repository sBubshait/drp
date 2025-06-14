import { useRef, useEffect, useState } from "react";
import { getCoords, getId, getNotId, resetScroll } from "./feedScrollController";
import "./feed.css";

export default function Feed() {

  // If you see a brief 'ghost image' of a future page, turn this number higher
  const TP_TIMEOUT = 300;

  const [offset, setOffset] = useState({x: 0, y: 0});
  const [specialPage, setSpecialPage] = useState({id: null, element: null});
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

      const element =
          <div key={id} id={getNotId(coords)} className={`col-start-${coords.trueCoords.x + 1} row-start-${coords.trueCoords.y + 1}`}> 
            {data}
          </div>

      if (id == specialPage.id) {
          setTimeout(() => setSpecialPage({...specialPage, element: element}), TP_TIMEOUT);
      } else {
          content.set(id, element);
    }
      
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
          setSpecialPage({id: getId()});
          //updateBlocks();
        }
      }, 80); // debounce
    }}>
      {[...feedContent.values()]}
      <specialPage />
    </div>
  );
}
