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

const possibleDesigns = (currentDesign, design, patterns) => {
  const designs = [];

  patterns.forEach((pattern) => {
    const newDesign = currentDesign + pattern;

    if (design.startsWith(newDesign)) {
      designs.push(newDesign);
    }
  });

  return designs;
};

const isPossibleToBuild = (design, patterns) => {
  const initialDesigns = possibleDesigns("", design, patterns);

  if (initialDesigns.length === 0) {
    return false;
  }

  const designsToTest = initialDesigns;

  while (designsToTest.length > 0) {
    const currentDesign = designsToTest.pop();

    if (currentDesign === design) {
      return true;
    }

    const newDesigns = possibleDesigns(currentDesign, design, patterns);

    if (newDesigns.length > 0) {
      newDesigns.forEach((newDesign) => designsToTest.push(newDesign));
    }
  }

  return false;
};

const numberOfPossibleDesigns = (designs, patterns) => {
  let total = 0;

  designs.forEach((design) => {
    if (isPossibleToBuild(design, patterns)) total++;
  });

  return total;
};

console.log(
  "numberOfPossibleDesigns",
  numberOfPossibleDesigns(targetDesigns, patterns),
);
