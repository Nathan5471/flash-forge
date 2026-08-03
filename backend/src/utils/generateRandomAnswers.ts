const generateRandomAnswers = (
  answers: string[],
  count: number,
  correctAnswer: string,
): string[] => {
  let possibleAnswers = answers.filter((answer) => answer !== correctAnswer);
  const randomAnswers: string[] = [correctAnswer];

  while (randomAnswers.length < count && possibleAnswers.length > 0) {
    const randomIndex = Math.floor(Math.random() * possibleAnswers.length);
    const randomAnswer = possibleAnswers[randomIndex];
    randomAnswers.push(randomAnswer);
    possibleAnswers = possibleAnswers.filter(
      (answer) => answer !== randomAnswer,
    );
  }

  const shuffled = [...randomAnswers];
  var n = randomAnswers.length,
    t,
    i;
  while (n) {
    i = (Math.random() * n--) | 0;
    t = shuffled[n];
    shuffled[n] = shuffled[i];
    shuffled[i] = t;
  }

  return shuffled;
};

export default generateRandomAnswers;
