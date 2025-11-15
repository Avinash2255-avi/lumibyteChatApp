import React, { useState } from 'react';

export default function AnswerFeedback({ initial = 'none', onFeedback } = {}) {
  const [feedback, setFeedback] = useState(initial);

  function handleLike() {
    const next = feedback === 'like' ? 'none' : 'like';
    setFeedback(next);
    if (typeof onFeedback === 'function') onFeedback(next);
  }

  function handleDislike() {
    const next = feedback === 'dislike' ? 'none' : 'dislike';
    setFeedback(next);
    if (typeof onFeedback === 'function') onFeedback(next);
  }

  
  const likeClasses =
    'px-2 py-1 rounded border transition inline-flex items-center gap-2 ' +
    (feedback === 'like' ? 'bg-green-600 text-white border-green-600' : 'bg-transparent text-gray-700 dark:text-gray-200');
  const dislikeClasses =
    'px-2 py-1 rounded border transition inline-flex items-center gap-2 ' +
    (feedback === 'dislike' ? 'bg-red-600 text-white border-red-600' : 'bg-transparent text-gray-700 dark:text-gray-200');

  return (
    <div className="mt-2 text-sm flex gap-2 justify-end" role="group" aria-label="Answer feedback">
      <button
        type="button"
        onClick={handleLike}
        className={likeClasses}
        aria-pressed={feedback === 'like'}
        aria-label="Like answer"
      >
        <span aria-hidden="true">👍</span>
        <span className="sr-only">Like</span>
      </button>

      <button
        type="button"
        onClick={handleDislike}
        className={dislikeClasses}
        aria-pressed={feedback === 'dislike'}
        aria-label="Dislike answer"
      >
        <span aria-hidden="true">👎</span>
        <span className="sr-only">Dislike</span>
      </button>
    </div>
  );
}
