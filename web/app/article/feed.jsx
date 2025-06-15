import { useRef, useEffect, useState } from "react";
import { getCoords, getId, getNotId } from "./feedScrollController";
import "./feed.css";

export default function Feed() {

  // If you see a brief 'ghost image' of a future page, turn this number higher
  const TP_TIMEOUT = 100;

  const [offset, setOffset] = useState({x: 0, y: 0});
  const [specialPage, setSpecialPage] = useState({id: null, element: null});

  const fetchedPages = useRef(new Map())

  // Manage feed content
  const genFeedContent = (virtualCoords) => {
   return <div className=""> {`x: ${virtualCoords.x} y: ${virtualCoords.y}`} </div>
  }

  const feedContent =
    getCoords(offset).filter((coords) => coords.virtualCoords).reduce((content, coords) => {
      
      const id = getId(coords);
      const notId = getNotId(coords);

      const cache = fetchedPages.current.get(id);
      const data = cache ? cache : genFeedContent(coords.virtualCoords);
      fetchedPages.current.set(id, data);

      const element =
          <div key={id} id={notId} className={`articleBlock col-start-${coords.trueCoords.x + 1} row-start-${coords.trueCoords.y + 1}`}> 
            {data}
          </div>

      if (notId == specialPage.notId) {
          setTimeout(() => {
            setSpecialPage({...specialPage, id: null, notId: null, element: element});
            //setRecenter(false);
          }, TP_TIMEOUT);
      } else {
          content.set(id, element);
    }
      
      return content;
    }, new Map())

  // On load
  useEffect(() => {
    const container = document.getElementById("grid");
    container.scrollLeft = container.offsetWidth * 4;
    container.scrollTop = container.offsetHeight * 4;
  })

  return(
    <div className="scroll-container" id="grid" onScroll={ (e) => {
      const container = e.currentTarget;
      clearTimeout(container._scrollTimeout);
      container._scrollTimeout = setTimeout(() => {
        const col = Math.round(container.scrollLeft / container.offsetWidth);
        const row = Math.round(container.scrollTop / container.offsetHeight);

        if (col != 4 || row != 4) {
          const offX = offset.x + col - 4;
          const offY = offset.y + row - 4;
          const id = `${offX}-${offY}`;
          const notId = `${col}-${row}`;

          setOffset({x: offX, y: offY});
          setSpecialPage({id: id, notId: notId, element: 
              <div key={id} id={notId} className={`articleBlock col-start-${col} row-start-${row}`}> 
                {fetchedPages.current.get(id)}
              </div>
            });
          //updateBlocks();
        }
      }, 80); // debounce
    }}>
      {specialPage.element}
      {[...feedContent.values()]}
    </div>
  );
}
