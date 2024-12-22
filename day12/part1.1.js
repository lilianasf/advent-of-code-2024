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
  return region.length;
};

const regionPerimeter = (region, gardens) => {
  let perimeter = 0;

  region.forEach((plot) => {
    const [plotValue, plotRow, plotCol] = plot;
    let finalOutsideSides;

    const adjacentPlots = adjacentPlotsWithPositions(
      plotRow,
      plotCol,
      gardens,
    ).filter((plot) => plot[0] !== plotValue);

    finalOutsideSides = adjacentPlots.length;

    if (plotRow === 0) {
      finalOutsideSides += 1;
    }

    if (plotCol === 0) {
      finalOutsideSides += 1;
    }

    if (plotRow === gardens.length - 1) {
      finalOutsideSides += 1;
    }

    if (plotCol === gardens[0].length - 1) {
      finalOutsideSides += 1;
    }

    perimeter += finalOutsideSides;
  });

  return perimeter;
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

  regions.forEach((region) => {
    const parsedRegion = Array.from(region).map((cenas) => {
      const [rowString, colString] = cenas.split("|");
      const row = Number(rowString);
      const col = Number(colString);
      return [gardens[row][col], row, col];
    });

    const area = regionArea(parsedRegion);
    const perimeter = regionPerimeter(parsedRegion, gardens);
    total += area * perimeter;
  });

  return total;
};

//const oraBolas = findRegion(0, 0, gardens)[1];

//console.log(findRegion(2, 0, oraBolas));

console.log(totalPrice(gardens));
