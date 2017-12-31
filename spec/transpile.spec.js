import fs from 'fs';
import path from 'path';
import transpile from '../tool/transpile.js';

const srcDir = path.normalize('src/');

const componentDirs = fs.readdirSync(srcDir)
  .map(componentDir => path.normalize(`${srcDir}/${componentDir}`));

componentDirs.forEach(componentDir => {

  const appDir = path.normalize(`${componentDir}/app`);
  const dslDir = path.normalize(`${componentDir}/dsl`);
  const testDir = path.normalize(`${componentDir}/test`);

  const appFiles = fs.readdirSync(appDir);
  const dslFiles = fs.readdirSync(dslDir);
  const testFiles = fs.readdirSync(testDir);

  testFiles.forEach(testFileName => {

    try {

      const testFile = path.normalize(`${testDir}/${testFileName}`);

      const transpiledExpected = fs.readFileSync(testFile).toString();

      const testConfig = path.basename(testFile).split('.');
      
      const appFile = path.normalize(`${componentDir}/app/${testConfig[0]}.${testConfig[1]}`);
      const targetLang = testConfig[2];

      const transpiledActual = transpile(targetLang, appFile);

      describe(testFile, () => {
        it('matches the expectation fixture', () => {
          expect(transpiledActual).toEqual(transpiledExpected);
        });
      });

    } catch (err) {

      if (
        err.code !== 'MODULE_NOT_FOUND'
      ) {
        console.error(err);
      }

    }

  });

});