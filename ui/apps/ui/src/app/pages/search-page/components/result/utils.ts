export const shortText = (text: string, maxWords: number): string => {
  const words = text?.split(' ');
  const isTooLong = words?.length > maxWords;
  return isTooLong ? words.slice(0, maxWords).join(' ') + ' [...]' : text;
};
