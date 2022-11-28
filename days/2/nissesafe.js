const isParityBit = i => Math.log2(i) % 1 === 0;
const isRedundantBit = i => i === 0;

// Take 2^n - (n+1) bit data block and add parity bits
const encode = (n, d) => {
  if(d.length !== dataLength(n)) throw new Error("Block data needs to be length " + dataLength(n));

  const result = [0]; // Redundant bit
  for(let i = 1; i < blockSize(n); ++i) {
    if(isParityBit(i)) result.push(0); // Parity bit
    else result.push(d.shift()); // Data bit
  }

  for(let i = 0; i < n; ++i) {
    const parityBit = Math.pow(2, i);
    // Grab all 1's, and xor them. This will be 1 if odd, 0 if even.
    result[parityBit] = result.filter((el, i) => i & parityBit).reduce((acc, el) => acc ^ el, 0);
  }
  
  return result;
};

// Get the data bits from a verified block
const decode = (n, input) => {
  if(input.length !== blockSize(n)) throw new Error("Data block length must be a power of 2");
  return input.filter((el, i) => !isRedundantBit(i) && !isParityBit(i) );
}

// Split array into subarrays of length 2^n for decoding
const splitForDecode = (n, input) => {
  if(input.length % blockSize(n) !== 0) throw new Error("Input must be divisible by 2^" + n);

  const result = [];
  for(let i = 0; i < input.length; i += blockSize(n)) {
    result.push(
      input.slice(i, i+blockSize(n))
    );
  }
  return result;
}

// Split input into 2^n - (n+1) bit long arrays for encoding
const splitForEncode = (n, input) => {
  /* Pad input with 0's so we can split it into blocks */
  while(input.length % dataLength(n) !== 0) input.push(0);

  const result = [];
  for(let i = 0; i < input.length; i += dataLength(n)) {
    result.push(
      input.slice(i, i+dataLength(n))
    );
  }
  return result;
}

const fixFlip = (n, input) => {
  if(input.length !== blockSize(n)) throw new Error(`Data block must be of size 2^${n} (${blockSize(n)})`);

  // Super duper trixy bit level hack.
  // A correct block has the property that the index of all 1's xored together is 0.
  // This is what the parity bits are _actually_ for.
  // Thus, if a single bit is flipped, xor-ing will give the index of the flipped bit!
  const flipIndex = input.reduce((acc, el, index) => (el ? acc ^ index : acc), 0);
  
  // Flip bit
  input[flipIndex] = input[flipIndex] ^ 1;
  return input;
}

const addFlips = (n, input) => {
  for(let i = 0; i < input.length; ++i) {
    const flip = rand(0, 2) > 0;
    if(flip) {
      const index = rand(0, blockSize(n));
      input[i][index] = input[i][index] ^ 1; 
    }
  }
  return input;
}

const rand = (min, max) => Math.floor(Math.random() * (max-min) + min);

const blockSize = (n) => Math.pow(2, n);

const dataLength = (n) => Math.pow(2, n) - (n+1);

module.exports = {
  encode,
  decode,
  splitForEncode,
  splitForDecode,
  addFlips,
  fixFlip
}