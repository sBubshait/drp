import { useState, useRef, useEffect, useCallback, act } from "react";
import ApiService from '../../services/api.js'
import { API_URL } from "../../config.js";

export default function AnnotatedText({ text, annotations: fetchedAnnotations, segmentId }) {
  const [activeId, setActiveId] = useState(null);
  const [annotations, setAnnotations] = useState(fetchedAnnotations);
  const [localUpvotes, setLocalUpvotes] = useState(annotations.map((ann) => false))
  const annotationRefs = useRef({});

  const handleClick = useCallback(event => {
    const target = event.target
    if (!target.classList.contains("annotation")) {
      setActiveId(null);
    }
  }, [])

  const handleAnnotationClick = (id) => {
    setTimeout(() => {
      const ref = annotationRefs.current[id];
      if (ref) {
        ref.scrollIntoView({ behavior: activeId ? "smooth" : "auto", inline: "center" });
      }
      setActiveId(id);
    }, 50);
  };

  useEffect(() => {
    const sidebar = document.getElementById("annotationSidebar");
    const width = sidebar.offsetWidth;
    sidebar.style.position = "fixed";
    sidebar.style.width = `${width}px`;
    sidebar.style.bottom = "-340px";
  }, [])

  useEffect(() => {
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    }
  }, [handleClick])

  useEffect(() => {
    fetch(API_URL + `/getSegment?segmentId=${segmentId}`)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Handle the fetched data  
        // Set the annotations state with the fetched data
        if (data.status === 200) {
          setAnnotations(data.segment.annotations || []);
        }
      });
  }, [activeId]);

  const renderText = () => {
    let parts = [];
    let lastIndex = 0;

    annotations.forEach((ann, i) => {
      const { startPos, endPos, id } = ann;

      if (startPos > lastIndex) {
        parts.push(<span key={`plain-${i}`}>{text.slice(lastIndex, startPos)}</span>);
      }

      parts.push(
        <span
          key={`ann-${i}`}
          className={`annotation bg-yellow-300 cursor-pointer px-1 rounded-sm ${activeId === id ? "ring-2 ring-blue-500" : ""
            }`}
          onClick={() => handleAnnotationClick(id)}
        >
          {text.slice(startPos, endPos)}
        </span>
      );

      lastIndex = endPos;
    });

    parts.push(<span key="end">{text.slice(lastIndex)}</span>);
    return parts;
  };
  return (
    <div>
      <div className="flex">
        <div className="text-gray-700 leading-relaxed text-2xl">
          {renderText()}
        </div>
      </div>

      <div className="relative overflow-x-hidden gap-6">
        <div id="annotationSidebar" className="overflow-x-scroll gap-4 p-3 bg-gray-100 rounded"

          style={{
            scrollbarWidth: "none",
            transition: "all 270ms",
            transform: activeId ? "translateY(-350px)" : ""
          }}
        >
          <div className="flex gap-6">
            {annotations.map((ann, i) => (
              <div
                key={ann.id}
                ref={(el) => (annotationRefs.current[ann.id] = el)}
                className={`min-w-[250px] p-3 rounded shadow-sm cursor-pointer transition-all duration-200 ${activeId === ann.id
                  ? "bg-blue-100 border border-blue-500"
                  : "bg-white border border-transparent"
                  }`}
                onClick={() => setActiveId(ann.id)}
              >
                <p className="text-sm text-gray-600 font-bold mb-1">
                  {ann.authorName}
                </p>
                <p className="text-gray-600 text-sm mb-3">{ann.authorCredentials}</p>
                <p className="text-gray-800 text-sm">{ann.content}</p>
                <div
                  onClick={(e) => {
                    localUpvotes[i] = true; setLocalUpvotes(localUpvotes); ApiService.upvoteAnnotation(ann.id)
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors cursor-pointer mt-2"
                >
                  <button className="text-xl" style={{ padding: '8px 12px', cursor: 'pointer' }}>
                    👍
                  </button>
                  <span className="text-sm font-bold text-gray-600"> {localUpvotes[i] ? ann.upvotes : ann.upvotes} </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};