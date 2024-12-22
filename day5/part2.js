import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const rules = [];
const updates = [];

let readingRules = true;

for await (const line of readLines(Deno.stdin)) {
  if (!readingRules) {
    updates.push(line.split(","));
  } else if (line === "") {
    readingRules = false;
  } else {
    rules.push(line);
  }
}

const swapPages = (update) => {
  for (let pageIndex = 0; pageIndex < update.length; pageIndex++) {
    for (
      let currentPageIndex = 0;
      currentPageIndex < update.length;
      currentPageIndex++
    ) {
      const page = update[pageIndex];
      const currentPage = update[currentPageIndex];

      if (pageIndex === currentPageIndex) {
        continue;
      } else if (
        pageIndex < currentPageIndex &&
        rules.includes([currentPage, page].join("|"))
      ) {
        const newUpdate = [...update];
        newUpdate[currentPageIndex] = update[pageIndex];
        newUpdate[pageIndex] = update[currentPageIndex];

        return newUpdate;
      } else if (
        pageIndex > currentPageIndex &&
        rules.includes([page, currentPage].join("|"))
      ) {
        const newUpdate = [...update];
        newUpdate[pageIndex] = update[currentPageIndex];
        newUpdate[currentPageIndex] = update[pageIndex];

        return newUpdate;
      }
    }
  }

  return update;
};

const correctOrder = (update) => {
  let finalUpdate = update;

  while (swapPages(finalUpdate).join("") !== finalUpdate.join("")) {
    finalUpdate = swapPages(finalUpdate);
  }

  return finalUpdate;
};

let sum = 0;

updates.forEach((update) => {
  if (update.join("") !== correctOrder(update).join("")) {
    const correctUpdate = correctOrder(update);

    sum += Number(correctUpdate[Math.round(correctUpdate.length / 2) - 1]);
  }
});

console.log(sum);
