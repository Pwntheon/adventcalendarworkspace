// Take 11 bit data block and add parity bits
const encode = (d) => {
  if(d.length !== 11) throw new Error("Block data needs to be length 11");
  const result =
    [0,       0,    0,  d[0],
     0,    d[1], d[2],  d[3],
     0,    d[4], d[5],  d[6],
     d[7], d[8], d[9], d[10]];
  
     // Add groups and set parity bit to 1 if odd.
     // xor will give 1 if odd, 0 if even, so we just set parity bit to
     // result of xor
     result[1] = result[1] ^ result[3] ^ result[ 5] ^ result[ 7] ^ result[ 9] ^ result[11] ^ result[13] ^ result[15];
     result[2] = result[2] ^ result[3] ^ result[ 6] ^ result[ 7] ^ result[10] ^ result[11] ^ result[14] ^ result[15];
     result[4] = result[4] ^ result[5] ^ result[ 6] ^ result[ 7] ^ result[12] ^ result[13] ^ result[14] ^ result[15];
     result[8] = result[8] ^ result[9] ^ result[10] ^ result[11] ^ result[12] ^ result[13] ^ result[14] ^ result[15];

     return result;
};

// Get the data bits from a verified block
const getDataFromBlock = (input) => {
  if(input.length !== 16) throw new Error("Block data needs to be length 16");
  return [ /*  -   */ /*  p   */ /*  p   */ input[ 3],
           /*  p   */ input[ 5], input[ 6], input[ 7],
           /*  p   */ input[ 9], input[10], input[11],
           input[12], input[13], input[14], input[15]];
}

const splitForDecode = (input) => {
  if(input.length % 16 !== 0) throw new Error("Input must be divisible by 16");

  const result = [];
  for(let i = 0; i < input.length; i += 16) {
    result.push(
      input.slice(i, i+16)
    );
  }
  return result;
}

// Split input into 11-bit long arrays for encoding
const splitForEncode = (input) => {
  /* Pad input with 0's so we can split it into even 11s */
  while(input.length % 11 !== 0) input.push(0);

  const result = [];
  for(let i = 0; i < input.length; i += 11) {
    result.push(
      input.slice(i, i+11)
    );
  }
  return result;
}

const fixFlip = (input) => {
  if(input.length !== 16) throw new Error("Block data needs to be length 16");

  // Super duper trixy bit level hack.
  // If a bit is flipped, index of all 1's xored together equals
  // index of flipped bit. Otherwise it's 0. Don't ask me why ;)
  const flipIndex = input.reduce((acc, el, index) => (el ? acc ^ index : acc), 0);
  
  // Flip bit
  input[flipIndex] = input[flipIndex] ^ 1;
  return input;
}

module.exports = {
  encode,
  splitForEncode,
  splitForDecode,
  getDataFromBlock,
  fixFlip
}