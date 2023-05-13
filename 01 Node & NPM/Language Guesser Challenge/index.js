const franc = require('franc');
const lang = require('langs');
const colors = require('colors')

const input = process.argv[2];
const langCode = franc(input);

if (langCode === 'und') {
    console.log("INVALID, COULDN'T FIGURE OUT, TRY AGAIN!!!".red);
} else {
    const language = lang.where("3", langCode);
    console.log(`YAY, THE LANGUAGE IS: ${language.name}!!!`.rainbow);
}