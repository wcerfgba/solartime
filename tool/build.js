import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import transpile from './transpile';

// targetDir is the directory in `src/` containing a `template/`
// buildDir is the output dir
export default function build(targetDir, buildDir = 'build/') {
  const rootDir = path.dirname(targetDir);
  const targetTemplateDir = `${targetDir}/template`;
  const targetName = path.basename(targetDir).split('.')[0];

  const targetBuildDir = `${buildDir}/${targetName}`;

  child_process.execSync(`rm -rf ${targetBuildDir}`);
  child_process.execSync(`mkdir -p ${targetBuildDir}`);
  child_process.execSync(`cp -r ${targetTemplateDir}/* ${targetBuildDir}`);

  const replacementsGrep = child_process.execSync(`grep -ron "### .* ###" ${targetBuildDir}`).toString();
  
  console.log(replacementsGrep);
  
  const replacements = replacementsGrep
    .split('\n')
    .filter(line => line)
    .map(grepLine => grepLine.split(':'))
    .map(grepLineParts => ({
      targetBuildFile: grepLineParts[0],
      lineNumber: parseInt(grepLineParts[1]) - 1,
      sourceFile: grepLineParts[2].match(/### (.*) ###/)[1]
    }))
    .map(replacement => ({
      ...replacement,
      targetLang: path.extname(replacement.targetBuildFile).slice(1)
    }));

  replacements.forEach(replacement => {

    const targetBuildLines = fs.readFileSync(replacement.targetBuildFile)
      .toString()
      .split('\n');

    const sourceFile = `${rootDir}/${replacement.sourceFile}`;

    const transpiledSource = transpile(replacement.targetLang, sourceFile);

    targetBuildLines[replacement.lineNumber] = transpiledSource;

    const targetBuild = targetBuildLines.join('\n');

    fs.writeFileSync(replacement.targetBuildFile, targetBuild);
  console.log(targetBuild, replacement.targetBuildFile);
  });
}

if (require.main === module) {
  const args = process.argv.slice(2);

  const targetDir = args[0];
  const buildDir = args[1];

  build(targetDir, buildDir);
}