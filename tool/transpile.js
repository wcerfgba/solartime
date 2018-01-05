import ohm from 'ohm-js';
import fs from 'fs';
import path from 'path';

export default function transpile(targetLang, sourceFile) {
  const sourceDir = path.dirname(sourceFile);
  const sourceDsl = path.extname(sourceFile).slice(1);

  const grammarFile = path.normalize(`${sourceDir}/../${sourceDsl}.dsl/${sourceDsl}.ohm`);
  const semanticsFile = path.normalize(`${sourceDir}/../${sourceDsl}.dsl/${sourceDsl}.${targetLang}`);

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
    return match.message;
  }

  const transpiled = semantics(match)[targetLang];

  return transpiled;
}

if (require.main === module) {
  const args = process.argv.slice(2);

  const targetLang = args[0];
  const sourceFile = args[1];

  const result = transpile(targetLang, sourceFile);

  console.log(result);
}