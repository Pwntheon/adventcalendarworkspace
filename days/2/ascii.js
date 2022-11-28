

const toBits = (text) =>
  Array.from(text)
    .reduce((acc, char) =>
      acc.concat(char.charCodeAt(0).toString(2)), [])
    .map(bin => '0'.repeat(8 - bin.length) + bin)
    .reduce((acc, bin) => 
      acc.concat(bin.split('')), [])
    .map(char => parseInt(char, 2));

const bitsPerChar = 8;
const fromBits = (bits) => {
  const stringified = bits.map(b => "" + b).join('');
  let result = "";
  for(let i = 0; i < bits.length; i += bitsPerChar) {
    result += String.fromCharCode(
      parseInt(
        stringified.slice(i, i+bitsPerChar), 2
      )
    );
  }
  return result;
}



module.exports = {
  toBits,
  fromBits
}