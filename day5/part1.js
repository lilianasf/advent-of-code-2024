import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const rules = [];
const updates = [];

let readingRules = true;

for await (const line of readLines(Deno.stdin)) {
  //worldPuzzle.push(line.split(""));
  if (!readingRules) {
    updates.push(line.split(","));
  } else if (line === "") {
    readingRules = false;
  } else {
    rules.push(line);
  }
}

const isRightOrder = (update) => {
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
        return false;
      } else if (
        pageIndex > currentPageIndex &&
        rules.includes([page, currentPage].join("|"))
      ) {
        return false;
      }
    }
  }

  return true;
};

const filteredUpdates = updates.filter((update) => isRightOrder(update));

let sum = 0;

filteredUpdates.forEach((update) => {
  sum += Number(update[Math.round(update.length / 2) - 1]);
});

console.log(sum);
