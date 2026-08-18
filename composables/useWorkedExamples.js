// Normalizes the `worked_examples` column into a flat list of { id, url } image entries.
// The column has been written in a couple of shapes by different tools/editors, so this
// accepts all of them rather than assuming one: a JSON array of plain URL strings, a JSON
// array of { problem, solution } example objects, or a single bare URL string.
export function useWorkedExamples(raw) {
  if (!raw) return [];

  let parsed = raw;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return [{ id: 1, url: raw }];
    }
  }

  const items = Array.isArray(parsed) ? parsed : [parsed];
  const urls = [];
  for (const item of items) {
    if (!item) continue;
    if (typeof item === "string") {
      urls.push(item);
    } else if (typeof item === "object") {
      if (item.problem) urls.push(item.problem);
      if (item.solution) urls.push(item.solution);
      if (item.url) urls.push(item.url);
    }
  }

  return urls.filter(Boolean).map((url, idx) => ({ id: idx + 1, url }));
}
