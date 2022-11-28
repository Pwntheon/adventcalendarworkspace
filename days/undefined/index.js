const { test, readInput } = require("../../utils");

console.clear();
const prepareInput = (rawInput) => {
    let input = rawInput;
    
    return input;
};

const input = prepareInput(readInput());

const getSolution = (input) => {
  return ""
};

/* Tests */

test(
  /* Result */ 1,
  /* Expect */ 1
);


/* Results */

console.time("Time");
const result = getSolution(input);
console.timeEnd("Time");

console.log("Solution:", result)