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

const possiblePatterns = (currentDesign, design, patterns) => {
  const designs = [];

  patterns.forEach((pattern) => {
    const newDesign = currentDesign + pattern;

    if (design.startsWith(newDesign)) {
      designs.push(newDesign);
    }
  });

  return designs;
};

const numberOfWaysToMakeDesign = (design, patterns, designsWays) => {
  const initialDesigns = possibleDesigns("", design, patterns);

  if (initialDesigns.length === 0) {
    return 0;
  }

  console.log("initialDesigns", initialDesigns);

  const designsToTest = initialDesigns;
  let numberOfWaysToMakeDesign = 0;
  const seenDesigns = {};

  while (designsToTest.length > 0) {
    const currentDesign = designsToTest.pop();

    console.log("currentDesign", currentDesign);

    if (currentDesign === design) {
      numberOfWaysToMakeDesign++;

      continue;
    }

    let newDesigns;

    if (seenDesigns[currentDesign]) {
      newDesigns = seenDesigns[currentDesign];
    } else {
      const designsToTest = possibleDesigns(currentDesign, design, patterns);

      newDesigns = designsToTest;
      seenDesigns[currentDesign] = designsToTest;
    }

    if (newDesigns.length > 0) {
      newDesigns.forEach((newDesign) => designsToTest.push(newDesign));
    }
  }

  return numberOfWaysToMakeDesign;
};

const possibleWaysToMakeDesigns = (designs, patterns) => {
  let total = 0;
  const chunksDesignsTotals = {};

  designs.forEach((design) => {
    const chunks = [];

    for (let i = 0, charsLength = design.length; i < charsLength; i += 4) {
      chunks.push(design.substring(i, i + 4));
    }

    console.log("design and chunks", design, chunks);

    let currentDesignTotal = 0;

    chunks.forEach((chunk) => {
      if (chunksDesignsTotals[chunk]) {
        console.log("using a saved one");
        currentDesignTotal += chunksDesignsTotals[chunk];
      } else {
        const numberOfWays = numberOfWaysToMakeDesign(chunk, patterns);

        chunksDesignsTotals[chunk] = numberOfWays;

        currentDesignTotal += numberOfWays;
      }
    });

    console.log("design total", currentDesignTotal);
    console.log("------");

    total += currentDesignTotal;
  });

  return total;
};

// currentSubstring -> b
const testingRe = (
  targetDesign,
  patterns,
  seenDesigns,
  currentDesign,
  nextDesign,
) => {
  // Begin
  if (currentDesign === undefined) {
    const initialDesigns = possibleDesigns(targetDesign, patterns);

    if (initialDesigns.length === 0) {
      return 0;
    } else {
      let total = 0;

      initialDesigns.forEach((design) => {
        const nextSubstring = targetDesign.slice(design.length);

        if (seenDesigns[nextSubstring]) {
          total += seenDesigns[nextSubstring];
        } else {
          const cost = testingRe(
            targetDesign,
            patterns,
            seenDesigns,
            design,
            nextSubstring,
          );

          seenDesigns[nextSubstring] = cost;

          total += cost;
        }
      });

      return total;
    }
  } else if (currentDesign === targetDesign) {
    return 1;
  } else {
    const designs = possibleDesigns(nextDesign, patterns);

    let total = 0;

    designs.forEach((design) => {
      const joinedDesign = currentDesign + design;
      const nextSubstring = targetDesign.slice(joinedDesign.length);

      if (seenDesigns[nextSubstring]) {
        return (total += seenDesigns[nextSubstring]);
      } else {
        const cost = testingRe(
          targetDesign,
          patterns,
          seenDesigns,
          joinedDesign,
          nextSubstring,
        );

        if (nextSubstring !== "") {
          seenDesigns[nextSubstring] = cost;
        }
        total += cost;
      }
    });

    if (!seenDesigns[nextDesign]) {
      seenDesigns[nextDesign] = total;
    }

    return total;
  }
};

const findNumberOfCombinations = (design, patterns) => {
  const seenCombinations = {};

  return testingRe(design, patterns, seenCombinations);
};

let total = 0;

targetDesigns.forEach(
  (design) => (total += findNumberOfCombinations(design, patterns)),
);

console.log("sum", total);
