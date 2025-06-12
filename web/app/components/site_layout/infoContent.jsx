import { useState } from 'react';
import AnnotatedText from "../question_elements/annotatedText"
import ContextBox from '../common/contextBox';

export default function InfoContent({ content }) {

  if (!content) {
    return (
      <p> Loading... </p>
    )
  }

  const { body, annotations, id } = content;

  return (
    <>
      <div className="block p-6">
        <AnnotatedText text={body} annotations={annotations} segmentId={id} />
      </div>
    </>
  );
}
