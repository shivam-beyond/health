export default function getNextQuestionIndex (questions, answers, currentQuestionIndex) {
  let nextIndex = currentQuestionIndex + 1;

  while (nextIndex < questions.length) {
    const nextQuestion = questions[nextIndex];

    if (!nextQuestion.preCondition) {
      return nextIndex;
    }

    const { questionId, value } = nextQuestion.preCondition;
    if (answers[questionId] === value) {
      return nextIndex;
    }

    nextIndex++;
  }

  return questions.length
};