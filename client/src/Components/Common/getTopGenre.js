
const capitalizeWords = (str) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export const getTopGenres = (data) => {
  if (!data) return null;

  const genres = [];
  data.forEach((d) => {
    d.genres.forEach((g) => {
      genres.push(g);
    });
  });

  const counts = {};
  genres.forEach((g) => {
    counts[g] = (counts[g] || 0) + 1;
  });

  const sortable = [];
  const keys = Object.keys(counts);
  keys.forEach((k) => {
    sortable.push([capitalizeWords(k), counts[k]]);
  });

  return sortable.sort((a, b) => b[1] - a[1]);
};
