import {useState} from 'react';
import ContextBox from "../question_elements/contextBox.jsx";

export default function InfoContent({content}) {

  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  const {context} = content;

  return (
    <>
      <div className="flex-1 p-6">
        <div className="flex">
          <div className="text-gray-700 leading-relaxed text-2xl">
            {context}
          </div>
        </div>
      </div>
    </>
  );
}
