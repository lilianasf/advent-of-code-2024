import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const worldPuzzle = [];

for await (const line of readLines(Deno.stdin)) {
  worldPuzzle.push(line.split(""));
}

const regex = /(XMAS|SAMX)/g;

const numberOfXmasHorizontal = (puzzle, rowIndex, colIndex) => {
  let matches = 0;

  // Search horizontally left to right
  if (colIndex > 0 && colIndex < puzzle[0].length - 3) {
    const targetCharArray = puzzle[rowIndex].slice(colIndex, colIndex + 4);

    if (targetCharArray.join("") === "XMAS") {
      matches += 1;
    }
  }

  // Search horizontally right to left
  if (colIndex < 4) {
    const targetCharArray = puzzle[rowIndex].slice(
      currentColIndex - 4,
      currentColIndex,
    );

    if (targetCharArray.join("") === "SAMX") {
      matches += 1;
    }
  }

  return matches;
};

const getColumnString = (puzzle, colIndex) => {
  return puzzle.map((row) => row[colIndex]);
};

const getDiagonalStringArray = (puzzle, rowIndex, colIndex) => {
  let currentRowIndex = rowIndex;
  let currentColIndex = colIndex;
  const diagonalStringArray = [];

  while (
    currentRowIndex < puzzle.length &&
    currentColIndex < puzzle[rowIndex].length
  ) {
    diagonalStringArray.push(puzzle[currentRowIndex][currentColIndex]);

    currentRowIndex += 1;
    currentColIndex += 1;
  }

  return diagonalStringArray;
};

const getReverseDiagonalStringArray = (puzzle, rowIndex, colIndex) => {
  let currentRowIndex = rowIndex;
  let currentColIndex = colIndex;
  const diagonalReverseStringArray = [];

  while (currentRowIndex < puzzle.length && currentColIndex >= 0) {
    diagonalReverseStringArray.push(puzzle[currentRowIndex][currentColIndex]);

    currentRowIndex += 1;
    currentColIndex -= 1;
  }

  return diagonalReverseStringArray;
};

const getDiagonalMatches = (puzzle, rowIndex) => {
  let totalMatches = 0;

  for (let i = 0; i < puzzle[rowIndex].length; i++) {
    const diagonalString = getDiagonalStringArray(puzzle, rowIndex, i);
    const diagonalReverseString = getReverseDiagonalStringArray(
      puzzle,
      rowIndex,
      i,
    );

    totalMatches += xmasMatches(diagonalString);
    totalMatches += xmasMatches(diagonalReverseString);
  }

  return totalMatches;
};

const xmasMatches = (charsArray) => {
  let totalMatches = 0;

  charsArray.forEach((char, index) => {
    if (char === "X") {
      const leftmostPosition = index - 3;
      const rightmostPosition = index + 3;

      if (leftmostPosition >= 0) {
        const reverWord = charsArray.slice(index - 3, index + 1);

        if (reverWord.join("") === "SAMX") {
          totalMatches += 1;
        }
      }

      if (rightmostPosition <= charsArray.length - 1) {
        const word = charsArray.slice(index, index + 4);

        if (word.join("") === "XMAS") {
          totalMatches += 1;
        }
      }
    }
  });

  return totalMatches;
};

let matches = 0;

worldPuzzle.forEach((row, rowIndex) => {
  // matches horizontal
  matches += xmasMatches(row);

  if (rowIndex === 0) {
    row.forEach((char, colIndex) => {
      matches += xmasMatches(getColumnString(worldPuzzle, colIndex));
    });

    matches += getDiagonalMatches(worldPuzzle, 0);
  } else if (rowIndex !== 0) {
    const firstDiagonalString = getDiagonalStringArray(
      worldPuzzle,
      rowIndex,
      0,
    );
    const firstDiagonalReverseString = getReverseDiagonalStringArray(
      worldPuzzle,
      rowIndex,
      0,
    );
    const lastDiagonalString = getDiagonalStringArray(
      worldPuzzle,
      rowIndex,
      worldPuzzle[rowIndex].length - 1,
    );
    const lastDiagonalReverseString = getReverseDiagonalStringArray(
      worldPuzzle,
      rowIndex,
      worldPuzzle[rowIndex].length - 1,
    );

    matches += xmasMatches(firstDiagonalString);
    matches += xmasMatches(firstDiagonalReverseString);
    matches += xmasMatches(lastDiagonalString);
    matches += xmasMatches(lastDiagonalReverseString);
  }
});

console.log(matches);
