import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const map = [];
const antennaHashMap = {};
let i = 0;

for await (const line of readLines(Deno.stdin)) {
  const row = line.split("");

  row.map((char, colIndex) => {
    if (char !== ".") {
      if (char in antennaHashMap) {
        antennaHashMap[char].push([i, colIndex]);
      } else {
        antennaHashMap[char] = [[i, colIndex]];
      }
    }
  });

  map.push(row);
  i++;
}

const numberOfAntinodesAndUpdateMap = (antennaName) => {
  const antennasPositions = antennaHashMap[antennaName];
  let numberOfAntinodes = 0;

  for (let i = 0; i < antennasPositions.length; i++) {
    for (let j = i + 1; j < antennasPositions.length; j++) {
      const [firstAntennaRow, firstAntennaCol] = antennasPositions[i];
      const [secondAntennaRow, secondAntennaCol] = antennasPositions[j];

      const distanceHorizontal = secondAntennaRow - firstAntennaRow;

      let isSecondAntennaToTheRight = true;

      if (secondAntennaCol < firstAntennaCol) {
        isSecondAntennaToTheRight = false;
      }

      const distanceVertical = Math.abs(secondAntennaCol - firstAntennaCol);

      let antinode1RowIndex;
      let antinode1ColIndex;
      let antinode2RowIndex;
      let antinode2ColIndex;

      let isToAddMoreAntinodes = true;
      let increment = 0;

      while (isToAddMoreAntinodes) {
        const currentNumberOfAntinodes = numberOfAntinodes;

        if (isSecondAntennaToTheRight) {
          antinode1RowIndex = secondAntennaRow + increment * distanceHorizontal;
          antinode1ColIndex = secondAntennaCol + increment * distanceVertical;
          antinode2RowIndex = firstAntennaRow - increment * distanceHorizontal;
          antinode2ColIndex = firstAntennaCol - increment * distanceVertical;
        } else {
          antinode1RowIndex = secondAntennaRow + increment * distanceHorizontal;
          antinode1ColIndex = secondAntennaCol - increment * distanceVertical;
          antinode2RowIndex = firstAntennaRow - increment * distanceHorizontal;
          antinode2ColIndex = firstAntennaCol + increment * distanceVertical;
        }

        if (
          antinode1RowIndex >= 0 &&
          antinode1RowIndex < map.length &&
          antinode1ColIndex >= 0 &&
          antinode1ColIndex < map[0].length
        ) {
          map[antinode1RowIndex][antinode1ColIndex] = "#";
          numberOfAntinodes += 1;
        }

        if (
          antinode2RowIndex >= 0 &&
          antinode2RowIndex < map.length &&
          antinode2ColIndex >= 0 &&
          antinode2ColIndex < map[0].length
        ) {
          map[antinode2RowIndex][antinode2ColIndex] = "#";
          numberOfAntinodes += 1;
        }

        isToAddMoreAntinodes = currentNumberOfAntinodes !== numberOfAntinodes;
        increment++;
      }
    }
  }

  return numberOfAntinodes;
};

const getNumberOfAntinodes = () => {
  let totalNumberOfAntinodes = 0;

  Object.keys(antennaHashMap).map((antennaName) => {
    totalNumberOfAntinodes += numberOfAntinodesAndUpdateMap(antennaName);
  });

  let numberOfAntinodes = 0;

  map.forEach((row) => {
    row.forEach((char) => {
      if (char === "#") {
        numberOfAntinodes += 1;
      }
    });
  });

  return numberOfAntinodes;
};

console.log(getNumberOfAntinodes());
