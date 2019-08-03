export function objectFromEntries(entries) {
  // Node 11 does not support Object.fromEntries yet, I implemented it myself
  // TODO: repace this function for `Object.fromEntries` when you have Node 12
  const result = {};
  entries.forEach(entry => {
    result[entry[0]] = entry[1];
  });
  return result;
}
