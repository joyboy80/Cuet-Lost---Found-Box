const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "was",
  "with",
]);

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value) =>
  normalize(value)
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const jaccardSimilarity = (tokensA, tokensB) => {
  if (!tokensA.length || !tokensB.length) {
    return 0;
  }

  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
};

const exactFieldMatch = (a, b) => {
  if (!a || !b) return 0;
  return normalize(a) === normalize(b) ? 1 : 0;
};

export const compareItemsSimilarity = (itemA, itemB) => {
  const titleScore = jaccardSimilarity(tokenize(itemA.title), tokenize(itemB.title));
  const descriptionScore = jaccardSimilarity(
    tokenize(itemA.description),
    tokenize(itemB.description)
  );
  const categoryScore = exactFieldMatch(itemA.category, itemB.category);
  const locationScore = exactFieldMatch(itemA.location, itemB.location);

  const weightedScore =
    titleScore * 0.5 +
    descriptionScore * 0.35 +
    categoryScore * 0.1 +
    locationScore * 0.05;

  return {
    titleScore,
    descriptionScore,
    categoryScore,
    locationScore,
    score: Number(weightedScore.toFixed(4)),
  };
};

export const isStrongItemMatch = (comparison) =>
  comparison.score >= 0.42 ||
  (comparison.titleScore >= 0.5 && comparison.descriptionScore >= 0.25);
