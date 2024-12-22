import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const gardens = [];

for await (const line of readLines(Deno.stdin)) {
  gardens.push(line.split(""));
}

const adjacentPlotsWithPositions = (rowIndex, colIndex, gardens) => {
  const positions = [];

  // top
  if (rowIndex > 0) {
    const neighborRowIndex = rowIndex - 1;
    const neighborColIndex = colIndex;

    const neighbor = gardens[neighborRowIndex][neighborColIndex];

    positions.push([neighbor, neighborRowIndex, neighborColIndex]);
  }

  // left
  if (colIndex > 0) {
    const neighborRowIndex = rowIndex;
    const neighborColIndex = colIndex - 1;
    const neighbor = gardens[neighborRowIndex][neighborColIndex];

    positions.push([neighbor, neighborRowIndex, neighborColIndex]);
  }

  // right
  if (colIndex < gardens[0].length - 1) {
    const neighborRowIndex = rowIndex;
    const neighborColIndex = colIndex + 1;
    const neighbor = gardens[neighborRowIndex][neighborColIndex];

    positions.push([neighbor, neighborRowIndex, neighborColIndex]);
  }

  // bottom
  if (rowIndex < gardens.length - 1) {
    const neighborRowIndex = rowIndex + 1;
    const neighborColIndex = colIndex;

    const neighbor = gardens[neighborRowIndex][neighborColIndex];

    positions.push([neighbor, neighborRowIndex, neighborColIndex]);
  }

  return positions;
};

const regionArea = (region) => {
  return region.size;
};

const parsedRowAndCol = (rowAndColString) => {
  const [plotRowString, plotColString] = rowAndColString.split("|");

  return [Number(plotRowString), Number(plotColString)];
};

const adjNotSameNamePos = (row, col, gardens) => {
  const regionName = gardens[row][col];
  const pos = [];

  if (row === 0 || gardens[row - 1][col] !== regionName) {
    pos.push(`top|${row}|${col}`);
  }

  if (row === gardens.length - 1 || gardens[row + 1][col] !== regionName) {
    pos.push(`bottom|${row}|${col}`);
  }

  if (col === 0 || gardens[row][col - 1] !== regionName) {
    pos.push(`left|${row}|${col}`);
  }

  if (col === gardens[0].length - 1 || gardens[row][col + 1] !== regionName) {
    pos.push(`right|${row}|${col}`);
  }

  return pos;
};

const regionNumberOfSides = (region, gardens) => {
  const plots = Array.from(region);

  console.log("plots", plots);
  const outsidePos = new Set();

  for (let i = 0; i < plots.length; i++) {
    const [currentRow, currentCol] = parsedRowAndCol(plots[i]);
    adjNotSameNamePos(currentRow, currentCol, gardens).forEach((pos) =>
      outsidePos.add(pos),
    );
  }

  const positions = Array.from(outsidePos);
  const filteredPos = positions.filter((pos) => {
    if (pos.startsWith("top")) {
      const [direction, row, col] = pos.split("|");
      return !positions.includes(`${direction}|${row}|${Number(col - 1)}`);
    } else if (pos.startsWith("bottom")) {
      const [direction, row, col] = pos.split("|");
      return !positions.includes(`${direction}|${row}|${Number(col - 1)}`);
    } else if (pos.startsWith("left")) {
      const [direction, row, col] = pos.split("|");
      return !positions.includes(
        `${direction}|${Number(row - 1)}|${Number(col)}`,
      );
    } else if (pos.startsWith("right")) {
      const [direction, row, col] = pos.split("|");
      return !positions.includes(
        `${direction}|${Number(row - 1)}|${Number(col)}`,
      );
    }

    return true;
  });

  console.log("outsidePos", outsidePos);

  console.log("filteredPos", filteredPos, filteredPos.length);
  return filteredPos.length;
};

const findRegion = (initialRow, initialCol, gardens) => {
  const updatedGardens = [...gardens];
  const differentGardenNameToExplore = new Set();
  let sameGardenNameToExplore = new Set([`${initialRow}|${initialCol}`]);
  const region = new Set([`${initialRow}|${initialCol}`]);

  const visited = new Set();

  while (sameGardenNameToExplore.size > 0) {
    const currentGardensSameName = Array.from(sameGardenNameToExplore);
    const currentPlotString = currentGardensSameName.pop();

    if (visited.has(currentPlotString)) {
      continue;
    }

    const [row, col] = currentPlotString.split("|");
    const rowIndex = Number(row);
    const colIndex = Number(col);

    adjacentPlotsWithPositions(rowIndex, colIndex, gardens).forEach(
      ([plotName, plotRow, plotCol]) => {
        const plotToString = `${plotRow}|${plotCol}`;

        if (
          plotName === gardens[rowIndex][colIndex] &&
          !visited.has(plotToString)
        ) {
          currentGardensSameName.push(plotToString);
          region.add(plotToString);
        } else if (!visited.has(plotToString) && plotName !== ".") {
          differentGardenNameToExplore.add(plotToString);
        }
      },
    );

    sameGardenNameToExplore = new Set(currentGardensSameName);
    visited.add(currentPlotString);
  }

  Array.from(region).forEach((plot) => {
    const [row, col] = plot.split("|");
    updatedGardens[Number(row)][Number(col)] = ".";
  });

  return [region, updatedGardens, Array.from(differentGardenNameToExplore)[0]];
};

const allRegions = (gardens) => {
  let startRow = 0;
  let startCol = 0;
  let currentGardens = [...gardens].map((row) => [...row]);
  const regions = [];

  let i = 0;

  while (Number.isFinite(startRow) && Number.isFinite(startCol)) {
    const [currentRegion, updatedGardens, startPosString] = findRegion(
      startRow,
      startCol,
      currentGardens,
    );

    if (!startPosString) {
      startRow = undefined;
      startCol = undefined;

      for (let row = 0; row < updatedGardens.length; row++) {
        for (let col = 0; col < updatedGardens[0].length; col++) {
          if (updatedGardens[row][col] !== ".") {
            startRow = row;
            startCol = col;
            break;
          }
        }
      }
    } else {
      const [rowString, colString] = startPosString.split("|");
      startRow = Number(rowString);
      startCol = Number(colString);
    }

    currentGardens = updatedGardens;
    regions.push(currentRegion);

    if (i == 3) {
      //break;
    }
    i++;
  }
  return regions;
};

const totalPrice = (gardens) => {
  const regions = allRegions(gardens);
  let total = 0;

  //console.log("regions", regions);

  regions.forEach((region) => {
    const area = regionArea(region);
    const sides = regionNumberOfSides(region, gardens);

    const firstPosition = parsedRowAndCol(Array.from(region)[0]);
    console.log(
      "REGION",
      gardens[firstPosition[0]][firstPosition[1]],
      area,
      sides,
    );
    total += area * sides;
  });

  return total;
};

console.log(totalPrice(gardens));
