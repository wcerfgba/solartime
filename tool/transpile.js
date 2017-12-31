import ohm from 'ohm-js';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

const targetLang = args[0];
const sourceFile = args[1];

const sourceDir = path.dirname(sourceFile);
const sourceDsl = path.extname(sourceFile).slice(1);

const grammarFile = path.normalize(`${sourceDir}/../dsl/${sourceDsl}.ohm`);
const semanticsFile = path.normalize(`${sourceDir}/../dsl/${sourceDsl}.${targetLang}`);

const actionDict = require(path.relative(__dirname, semanticsFile));

const source = fs.readFileSync(sourceFile).toString();
const grammar = ohm.grammar(fs.readFileSync(grammarFile));
const semantics = grammar.createSemantics()
  .addAttribute(
    targetLang,
    actionDict
  );

const match = grammar.match(source);

if (match.failed()) {
  console.error(match.message);
  process.exit(1);
}

const transpiled = semantics(match).js;

console.log(transpiled);