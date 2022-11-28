const { test, readInput } = require("../../utils");
const { encode, decode, splitForDecode, splitForEncode, addFlips, fixFlip } = require("./nissesafe");
const { toBits, fromBits } = require("./ascii");
const { writeFile } = require("fs");

console.clear();
const prepareInput = (rawInput) => {
  let input = rawInput.split('');    
  return input.map(n => parseInt(n, 2));;
};

const input = prepareInput(readInput());

const getSolution = (input) => {
  const chunked = splitForDecode(5, input);
  const fixed = chunked.map(e => fixFlip(5, e));
  const decoded = fixed.map((e) => decode(5, e));
  const decodedBits = [].concat(...decoded);
  return fromBits(decodedBits);
};


/* Code to generate problem */
// const address = "Richard Wesley Hamming, Bell Telephone Laboratories, Murray Hill, NJ";
// const bits = toBits(address);
// const chunkedBits = splitForEncode(5, bits);
// const code = chunkedBits.map((e) => encode(5, e));
// const flipped = addFlips(5, code);
// writeFile('./input2.txt', flipped.map(a => a.join("")).join(""), () => 0 );
 
/* Tests */

test(
  /* Result */ encode(4, [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0 ]),
  /* Expect */ [0, 1, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
);

test(
  /* Result */ decode( 4,
               [0, 1, 1, 1,
                0, 0, 0, 0,
                1, 0, 0, 1,
                0, 1, 1, 0]
               ),
  /* Expect */ [1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0]
);

test(
  /* Result */ toBits("ab"),
  /* Expect */ [0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0]
);

test(
  /* Result */ fromBits([0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0]),
  /* Expect */ "ab"
);

/* Results */

console.time("Time");
const result = getSolution(input);
console.timeEnd("Time");

console.log("Solution:", result)