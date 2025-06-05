import {useState, useRef} from "react";

export default function AnnotatedText({ text, annotations }) {
  const [activeId, setActiveId] = useState(null);
  const annotationRefs = useRef({});

  const handleClick = (id) => {
    setTimeout(() => {
      const ref = annotationRefs.current[id];
      if (ref) {
        ref.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }, 100);
  };

  const renderText = () => {
    let parts = [];
    let lastIndex = 0;

    annotations.forEach((ann, i) => {
      const { start, end, id } = ann;

      if (start > lastIndex) {
        parts.push(<span key={`plain-${i}`}>{text.slice(lastIndex, start)}</span>);
      }

      parts.push(
        <span
          key={`ann-${i}`}
          className={`bg-yellow-300 cursor-pointer px-1 rounded-sm ${
            activeId === id ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => handleClick(id)}
        >
          {text.slice(start, end)}
        </span>
      );

      lastIndex = end;
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
        <div id="annotationSidebar" className="fixed w-[340px] bottom-[10px] overflow-x-scroll gap-4 p-3 bg-gray-100 rounded"
             style={{scrollbarWidth: "none"}}>
          <div className="flex gap-6">
          {annotations.map((ann) => (
            <div
              key={ann.id}
              ref={(el) => (annotationRefs.current[ann.id] = el)}
              className={`min-w-[250px] p-3 rounded shadow-sm cursor-pointer transition-all duration-200 ${
                activeId === ann.id
                  ? "bg-blue-100 border border-blue-500"
                  : "bg-white border border-transparent"
              }`}
              onClick={() => setActiveId(ann.id)}
            >
              <p className="text-sm text-gray-600 font-medium mb-1">
                {ann.author}
              </p>
              <p className="text-gray-800 text-sm">{ann.content}</p>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};
