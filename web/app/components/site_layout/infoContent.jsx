import {useState} from 'react';
import AnnotatedText from "../question_elements/annotatedText"
import ContextBox from '../question_elements/contextBox';

export default function InfoContent({content}) {

  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  const {body, annotations} = content;

  return (
    <>
      <div className="block p-6">
          <AnnotatedText text={body} annotations={annotations}/>
        </div>
    </>
  );
}
