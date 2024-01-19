function shuffleArray<T>(listToShuffle: T[]): T[] {
  const shuffledList = [...listToShuffle];
  for (let i = shuffledList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
  }
  return shuffledList;
}

function getRandomItem<T>(array: T[]): T {
  const shuffledList = shuffleArray(array);
  const randomIndex = Math.floor(Math.random() * shuffledList.length);
  return shuffledList[randomIndex];
}

export { shuffleArray, getRandomItem };
