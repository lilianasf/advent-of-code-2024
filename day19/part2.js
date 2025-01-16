import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const patterns = [];
const targetDesigns = [];

let isToSaveDesigns = false;

for await (const line of readLines(Deno.stdin)) {
  if (isToSaveDesigns) {
    targetDesigns.push(line);
  } else if (line === "") {
    isToSaveDesigns = true;
  } else {
    patterns.push(
      line.split(", ").forEach((pattern) => patterns.push(pattern)),
    );
  }
}

const possibleDesigns = (currentDesign, patterns) => {
  const designs = [];

  patterns.forEach((pattern) => {
    if (currentDesign.startsWith(pattern)) {
      designs.push(pattern);
    }
  });

  return designs;
};

const getCombinations = (
  finalDesign,
  patterns,
  seenSubStrings,
  currentSubString,
  nextSubString,
) => {
  // Begin
  if (currentSubString === undefined) {
    const initialDesigns = possibleDesigns(finalDesign, patterns);

    if (initialDesigns.length === 0) {
      return 0;
    } else {
      let combinations = 0;

      initialDesigns.forEach((design) => {
        const nextSubstring = finalDesign.slice(design.length);

        if (seenSubStrings[nextSubstring]) {
          combinations += seenSubStrings[nextSubstring];
        } else {
          const cost = getCombinations(
            finalDesign,
            patterns,
            seenSubStrings,
            design,
            nextSubstring,
          );

          seenSubStrings[nextSubstring] = cost;

          combinations += cost;
        }
      });

      return combinations;
    }
  } else if (currentSubString === finalDesign) {
    return 1;
  } else {
    const designs = possibleDesigns(nextSubString, patterns);

    let combinations = 0;

    designs.forEach((design) => {
      const subString = currentSubString + design;
      const nextSubstring = finalDesign.slice(subString.length);

      if (seenSubStrings[nextSubstring]) {
        return (combinations += seenSubStrings[nextSubstring]);
      } else {
        const cost = getCombinations(
          finalDesign,
          patterns,
          seenSubStrings,
          subString,
          nextSubstring,
        );

        if (nextSubstring !== "") {
          seenSubStrings[nextSubstring] = cost;
        }

        combinations += cost;
      }
    });

    if (!seenSubStrings[nextSubString]) {
      seenSubStrings[nextSubString] = combinations;
    }

    return combinations;
  }
};

const findNumberOfCombinations = (design, patterns) => {
  const seenSubStrings = {};

  return getCombinations(design, patterns, seenSubStrings);
};

let total = 0;

targetDesigns.forEach(
  (design) => (total += findNumberOfCombinations(design, patterns)),
);

console.log("sum", total);
