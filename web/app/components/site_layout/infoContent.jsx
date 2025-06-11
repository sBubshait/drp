import {useState} from 'react';
import AnnotatedText from "../question_elements/annotatedText"
import ContextBox from '../question_elements/contextBox';

export default function InfoContent({content, interactCallback}) {

  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  const {body, annotations, id} = content;

  return (
    <>
      <div className="block p-6">
          <AnnotatedText text={body} annotations={annotations} segmentId={id} interactCallback={interactCallback}/>
        </div>
    </>
  );
}
