function shuffleArray(array: string[]): string[] {
  const shuffledList = [...array];
  let currentIndex = shuffledList.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffledList[currentIndex], shuffledList[randomIndex]] = [
      shuffledList[randomIndex],
      shuffledList[currentIndex]
    ];
  }
  return shuffledList;
}

export { shuffleArray };
