const { spawn } = require("child_process");
const { readdirSync } = require("fs");
const { cp } = require("shelljs");

const day = process.argv[2];
const days = readdirSync(`./days`);

if(!days.includes(day)) {
    console.log(`New day! Creating template for day ${day}.`);
    cp("-r", "template", `./days/${day}`);
}

spawn('nodemon.cmd', [`./days/${day}/index.js`], {
    stdio: 'inherit'
});