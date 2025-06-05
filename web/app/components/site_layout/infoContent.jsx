import {useState} from 'react';
import AnnotatedText from "../question_elements/annotatedText"
import ContextBox from '../question_elements/contextBox';

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

          <AnnotatedText text={context}
           annotations={[
                          {
                            id: 1,
                            start: 16,
                            end: 39,
                            content: "This is known misinformation.",
                            author: "Dr Charbonnier"
                          },
                          {
                            id: 2,
                            start: 40,
                            end: 42,
                            content: "The second!!",
                            author: "Dr Bui Van"
                          },
                          {
                            id: 3,
                            start: 62,
                            end: 80,
                            content: "The second!!",
                            author: "Dr Bui Van"
                          },
                        ]}
           />
        </div>
    </>
  );
}
