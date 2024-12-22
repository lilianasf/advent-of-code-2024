import { readLines } from "https://deno.land/std@0.224.0/io/mod.ts";

let rawInstructions = "";

for await (const line of readLines(Deno.stdin)) {
  rawInstructions = rawInstructions + line;
}

const regex = /\mul\(\d{1,3}\,\d{1,3}\)/g;
const filteredInstructions = rawInstructions.match(regex) || [];

let result = 0;

filteredInstructions.forEach((operation) => {
  // example: mul(1,2)
  // split by ",": ["mul(1", "2)"]
  const [beforeComma, afterComma] = operation.split(",");
  // split "mul(1" by "(": ["mul(", "1"]
  const [, firstDigit] = beforeComma.split("(");
  // split "2)" by ")": ["2", ")"]
  const [secondValue] = afterComma.split(")");

  result += Number(firstDigit) * Number(secondValue);
});

console.log(result);
