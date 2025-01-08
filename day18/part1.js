import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const bytes = [];

for await (const line of readLines(Deno.stdin)) {
  bytes.push(line.split(",").map((item) => Number(item)));
}

const possibleNeighbours = (puzzle, pos) => {
  const [x, y] = pos;
  const neighbours = [];

  // left
  if (x > 0) {
    neighbours.push([x - 1, y]);
  }

  // top
  if (y > 0) {
    neighbours.push([x, y - 1]);
  }

  // right
  if (x < puzzle[0].length - 1) {
    neighbours.push([x + 1, y]);
  }

  // bottom
  if (y < puzzle.length - 1) {
    neighbours.push([x, y + 1]);
  }

  return neighbours;
};

const shortestPath = (size, bytesPos) => {
  const puzzle = Array(size).fill(Array(size).fill("."));

  bytesPos.forEach((pos) => {
    const [x, y] = pos;
    const newRow = [...puzzle[y]];

    newRow[x] = "#";
    puzzle[y] = newRow;
  });

  puzzle.forEach((row) => console.log(row.join("")));

  const paths = [[0, [0, 0]]];
  const visitedPos = new Set();
  let finalSize;

  while (paths.length) {
    const [currentTotal, currentLasPos] = paths.shift();
    const [xCurrentLastPos, yCurrentLastPos] = currentLasPos;
    const posToString = `${xCurrentLastPos}|${yCurrentLastPos}`;

    if (visitedPos.has(posToString)) {
      continue;
    }

    visitedPos.add(posToString);

    if (
      xCurrentLastPos === puzzle.length - 1 &&
      yCurrentLastPos === puzzle.length - 1
    ) {
      return currentTotal;
    }

    possibleNeighbours(puzzle, currentLasPos).forEach((neighbour) => {
      const [xNeighbour, yNeighbour] = neighbour;
      if (puzzle[yNeighbour][xNeighbour] === ".") {
        paths.push([currentTotal + 1, neighbour]);
      }
    });
  }

  //puzzle.forEach((row) => console.log(row.join("")));

  return finalSize;
};

const bytesToUse = bytes.slice(0, 1024);

console.log("shortestPath", shortestPath(71, bytesToUse));
