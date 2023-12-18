export const sanitizeQuery = (q: string | undefined): string | null => {
  if (!q || q.trim() === '') {
    return null;
  }

  if (q.trim() === '*') {
    return '*';
  }

  const match = q.trim().match(/[^~@#$%^*{}"'|<>]+/g);
  if (!match) {
    return '*';
  }

  return match.join('');
};
