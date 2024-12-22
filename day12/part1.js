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
  const differentGardenNameToExplore = [];
  const sameGardenNameToExplore = [[initialRow, initialCol]];
  const currentGardens = [];
};

const allRegions = (gardens) => {
  const visitedPositionsAsString = [];
  let currentRegion = [[gardens[0][0], 0, 0]];
  let currentGarden = [];
  let plotsToExploreNext = [];
  const regions = [];

  while (currentRegion.length > 0) {
    const [value, rowIndex, colIndex] = currentRegion.pop();
    const posToString = `${rowIndex}|${colIndex}`;

    if (visitedPositionsAsString.includes(posToString)) {
      const nextPlot = plotsToExploreNext.pop();

      if (nextPlot) {
        currentRegion = [nextPlot];
      }

      continue;
    }

    const adjacentPlots = adjacentPlotsWithPositions(
      rowIndex,
      colIndex,
      gardens,
    ).filter(
      (plot) => !visitedPositionsAsString.includes(`${plot[1]}|${plot[2]}`),
    );

    const zeroAdjSameRegionPlots =
      adjacentPlots.filter((plot) => plot[0] === value).length === 0;

    if (currentGarden.length > 0 && (currentGarden[0] || [])[0] !== value) {
      plotsToExploreNext = [[value, rowIndex, colIndex], ...plotsToExploreNext];
      continue;
    }

    if (zeroAdjSameRegionPlots) {
      if (
        currentRegion.length > 0 &&
        currentRegion.filter((garden) => garden[0] === value).length ===
          currentRegion.length
      ) {
        continue;
      } else {
        const nextPlot = plotsToExploreNext.pop();

        regions.push(
          new Set(currentGarden.map((plot) => `${plot[1]}|${plot[2]}`)),
        );
        currentGarden = [];

        if (nextPlot) {
          currentRegion = [nextPlot];
        } else {
          currentRegion = [];
        }
        break;
      }
    } else {
      adjacentPlots.forEach((plot) => {
        const adjPosToString = `${plot[1]}|${plot[2]}`;
        if (!visitedPositionsAsString.includes(adjPosToString)) {
          const adjPlotValue = gardens[plot[1]][plot[2]];

          if (adjPlotValue === value) {
            currentRegion = [...currentRegion, plot];
          } else {
            plotsToExploreNext = [plot, ...plotsToExploreNext];
          }
        }
      });

      if (value === currentRegion[0][0]) {
        currentGarden.push([value, rowIndex, colIndex]);
      }
    }

    visitedPositionsAsString.push(`${rowIndex}|${colIndex}`);
  }

  return regions;
};

const totalPrice = (gardens) => {
  const regions = allRegions(gardens);
  let total = 0;

  regions.forEach((region) => {
    const parsedRegion = Array.from(region).map((positionString) => {
      const positions = positionString.split("|").map((value) => Number(value));

      return [gardens[positions[0]][positions[1]], ...positions];
    });
    const area = regionArea(parsedRegion);
    const perimeter = regionPerimeter(parsedRegion, gardens);
    total += area * perimeter;
  });

  return total;
};

console.log(totalPrice(gardens));
