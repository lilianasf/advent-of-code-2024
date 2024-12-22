import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const zerosPositions = [];
const topographicMap = [];

let currentRowIndex = 0;

for await (const line of readLines(Deno.stdin)) {
  const row = line.split("").map((value, colIndex) => {
    if (value === "0") {
      zerosPositions.push([0, currentRowIndex, colIndex]);
    }

    return Number(value);
  });

  currentRowIndex++;

  topographicMap.push(row);
}

const neighborsWithPositions = (rowIndex, colIndex) => {
  const positions = [];

  // top
  if (rowIndex > 0) {
    const neighborRowIndex = rowIndex - 1;
    const neighborColIndex = colIndex;

    const neighbor = topographicMap[neighborRowIndex][neighborColIndex];

    positions.push([neighbor, neighborRowIndex, neighborColIndex]);
  }

  // bottom
  if (rowIndex < topographicMap.length - 1) {
    const neighborRowIndex = rowIndex + 1;
    const neighborColIndex = colIndex;

    const neighbor = topographicMap[neighborRowIndex][neighborColIndex];

    positions.push([neighbor, neighborRowIndex, neighborColIndex]);
  }

  // right
  if (colIndex < topographicMap[0].length - 1) {
    const neighborRowIndex = rowIndex;
    const neighborColIndex = colIndex + 1;
    const neighbor = topographicMap[neighborRowIndex][neighborColIndex];

    positions.push([neighbor, neighborRowIndex, neighborColIndex]);
  }

  // left
  if (colIndex > 0) {
    const neighborRowIndex = rowIndex;
    const neighborColIndex = colIndex - 1;
    const neighbor = topographicMap[neighborRowIndex][neighborColIndex];

    positions.push([neighbor, neighborRowIndex, neighborColIndex]);
  }

  return positions;
};

const trailheads = () => {
  const possiblePaths = {};
  const paths = zerosPositions.map((value) => [value]);

  while (paths.length > 0) {
    const currentPath = paths.pop();
    const lastPathPosition = currentPath[currentPath.length - 1];
    const lastPathPositionValue = lastPathPosition[0];

    if (lastPathPositionValue === 9) {
      const [, zeroRowIndex, zeroColIndex] = currentPath[0];
      const zeroKey = [zeroRowIndex, zeroColIndex].join("");
      const [, nineRowIndex, nineColIndex] = lastPathPosition;
      const targetNineKey = [nineRowIndex, nineColIndex].join("");

      if (zeroKey in possiblePaths) {
        if (!possiblePaths[zeroKey].includes(targetNineKey)) {
          possiblePaths[zeroKey] = [...possiblePaths[zeroKey], targetNineKey];
        }
      } else {
        possiblePaths[zeroKey] = [targetNineKey];
      }
    } else {
      neighborsWithPositions(lastPathPosition[1], lastPathPosition[2]).forEach(
        (neighbor) => {
          const neighborValue = neighbor[0];

          if (neighborValue === lastPathPositionValue + 1) {
            paths.push([...currentPath, neighbor]);
          }
        },
      );
    }
  }

  return possiblePaths;
};

const sumOfTrailheads = () => {
  const trailheadsMap = trailheads();

  let sum = 0;

  Object.values(trailheadsMap).forEach((value) => {
    sum = sum + value.length;
  });

  return sum;
};

console.log(sumOfTrailheads());
