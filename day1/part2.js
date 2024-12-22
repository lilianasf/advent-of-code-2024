import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const leftValues = [];
const rightValues = [];

for await (const line of readLines(Deno.stdin)) {
  const [left, right] = line.split("   ");
  console.log(line);
  leftValues.push(Number(left));
  rightValues.push(Number(right));
}

const rightValuesCountsMap = {};

rightValues.forEach((value) => {
  if (value in rightValuesCountsMap) {
    rightValuesCountsMap[value] = rightValuesCountsMap[value] + 1;
  } else {
    rightValuesCountsMap[value] = 1;
  }
});

const smilarities = leftValues.map((value) => {
  if (value in rightValuesCountsMap) {
    return value * rightValuesCountsMap[value];
  }

  return 0;
});
const result = smilarities.reduce((a, b) => a + b);

console.log(result);
