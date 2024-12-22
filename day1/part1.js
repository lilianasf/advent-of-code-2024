import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

const leftValues = [];
const rightValues = [];

for await (const line of readLines(Deno.stdin)) {
  const [left, right] = line.split("   ");
  console.log(line);
  leftValues.push(Number(left));
  rightValues.push(Number(right));
}

const sortedLeftValues = leftValues.sort();
const sortedRightValues = rightValues.sort();

const distances = sortedLeftValues.map((leftValue, index) =>
  Math.abs(leftValue - sortedRightValues[index]),
);

const result = distances.reduce((a, b) => a + b);

console.log(result);
