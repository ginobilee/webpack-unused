#!/usr/bin/env node

'use strict';
const Path = require('path');
const Promisify = require('es6-promisify');
const fs = require('fs');

const Glob2 = Promisify(require('glob'));

const cwd = process.cwd();

const argv = require('yargs')
  .usage('Usage: $0 [options]')
  .example('$0 -s src --stats dist/stats.json --output dist/unused.txt', 'Check for unused files in the `src/` directory base on webpack stats')
  .example('$0 -s src --stats dist/stats.json --autodelete', 'Check for unused files in the `src/` directory base on webpack stats')
  .alias('s', 'src')
  .describe('s', 'Directory of source code')
  .default('s', '.')
  .describe('stats', 'webpack build stats file')
  .default('stats', './dist/stats.json')
  .describe('output', 'analyzed unused file result file location')
  .default('output', './dist/unused.txt')
  .describe('autodelete', 'auto delete unused file')
  .describe('suffix', 'restrict file suffixs to delete')
  // .default('autodelete', '0')
  .help('h')
  .alias('h', 'help').argv;

// specify which directory to look in for source files
const srcDir = Path.resolve(argv.src);
const statsFile = Path.resolve(argv.stats);
const outputFile = Path.resolve(argv.output);
const autodelete = argv.autodelete;
const suffix = argv.suffix;

const flatten = require('./flatten');

const findAllLocalFiles = () => {
  const realsuffix = suffix || '*';
  const localScan = `!(node_modules)/**/*.${realsuffix}`;
  return Glob2(localScan, { cwd: srcDir }).then(files =>
    files.map(f => Path.join(srcDir, f)),
  );
};

function withCwd(m) {
  return m.map(md => Path.join(cwd, md));
}
Promise.all([
  Promise.resolve(require(statsFile))
    // .then(flatten.getLocalModules)
    .then(flatten.getLocalModuleNames)
    .then(withCwd),
  findAllLocalFiles(),
]).then(args => {
  const webpackFiles = args[0];
  const localFiles = args[1];

  const localRouteFiles = localFiles.map(file => file.split(' ')[0]);
  const webpackRouteFields = webpackFiles;
  const unusedFiles = localRouteFiles.filter(f => webpackRouteFields.indexOf(f) === -1);
  const unusedFilesStr = unusedFiles.join('\n');
  // console.log(unusedFilesStr);

  // fs.writeFileSync(Path.join(__dirname, '../dist/unused.txt'), unusedFilesStr);
  fs.writeFileSync(outputFile, unusedFilesStr);
  // fs.writeFileSync(Path.join(__dirname, outputFile), unusedFilesStr);
  // 自动删除
  if (autodelete) {
    unusedFiles.forEach(file => {
      fs.unlinkSync(file);
    })
    console.log('file deleted');
  }
});
