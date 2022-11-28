const { test, readInput } = require("../../utils");
const { encode,
  splitForEncode,
  splitForDecode,
  getDataFromBlock,
  fixFlip} = require("./nissesafe.js");

console.clear();

const prepareInput = (rawInput) => {
    let input = rawInput.split('\r\n');
      
    return input.map(n => parseInt(n, 2));;
};

const data = prepareInput(readInput());

const getSolution = (input) => {
  const extractedData = splitForDecode(input)
          .map(fixFlip)
          .map(getDataFromBlock);
  return [].concat(...extractedData);
};

/* Tests */

test(
 /* Result */ splitForEncode([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
 /* Expect */ [[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
);

test(
  /* Result */ encode([1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0 ]),
  /* Expect */ [0, 1, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
);

test(
  /* Result */ getDataFromBlock(
               [0, 1, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
               ),
  /* Expect */ [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0]
);

test(
  /* Result */ fixFlip(
               [0, 1, 1, 1,
                0, 0, 1, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
               ),
  /* Expect */ [0, 1, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
);

test(
  /* Result */ fixFlip(
               [0, 0, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
               ),
  /* Expect */ [0, 1, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
);

test(
  /* Result */ fixFlip(
               [0, 1, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 1]
               ),
  /* Expect */ [0, 1, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
);

/* Results */

const solution = [
  1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0,
  0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0,
  0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1
];

console.time("Time");
const result = getSolution(data);
console.timeEnd("Time");

console.log("Problem:", data);
console.log("Solution:", result);
console.log("Correct answer:", solution); 
