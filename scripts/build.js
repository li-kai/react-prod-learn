require('dotenv').config();

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const { measureFileSizesBeforeBuild, printFileSizesAfterBuild } = require('react-dev-utils/FileSizeReporter');

const clientConfig = require('../webpack/client.prod.js');
const serverConfig = require('../webpack/server.prod.js');
const PATHS = require('../config/paths');

// Helper function for printing the folder paths
const prettyPath = fullPath => chalk.cyan(`${path.basename(PATHS.root)}${path.sep}${path.basename(fullPath)}`);

// Print out errors
function processErrors(summary, errors) {
  console.log(chalk.red('Failed to compile.'));
  console.log();

  errors.forEach((err) => {
    console.log(err.message || err);
    console.log();
  });
  process.exit(1);
}

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
  console.log('Creating an optimized production build...');
  console.log(chalk.dim('This might take a while. Go have a coffee or something.'));
  console.log();

  const handleWebpackErrors = (err, stats) => {
    if (err) {
      processErrors('Failed to compile.', [err]);
      process.exit(1);
    }

    if (stats.hasErrors()) {
      processErrors('Failed to compile.', stats.compilation.errors);
      process.exit(1);
    }

    if (process.env.CI && stats.hasWarnings()) {
      // eslint-disable-next-line max-len
      processErrors('Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.', stats.compilation.warnings);
      process.exit(1);
    }
  };

  // Compile files
  webpack([clientConfig, serverConfig]).run((err, { stats: [clientStats, serverStats] }) => {
    handleWebpackErrors(err, clientStats);
    handleWebpackErrors(err, serverStats);

    console.log(chalk.green('Compiled successfully.'));
    console.log();

    console.log('Client file sizes after gzip:');
    console.log();
    printFileSizesAfterBuild(clientStats, previousFileSizes, PATHS.dist);

    console.log();
    console.log(`The ${prettyPath(PATHS.dist)} folder is ready to be deployed.`);
  });
}

// Cleans and copies public folder to dist
function prepareForNewBuild() {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  console.log(`Cleaning ${prettyPath(PATHS.dist)}`);
  fs.emptyDirSync(PATHS.dist);
  // Merge with the public folder
  console.log(`Merging  ${prettyPath(PATHS.public)} into build.`);
  console.log();
  fs.copySync(PATHS.public, PATHS.dist, {
    dereference: true,
  });
}

if (process.env.NODE_EVV !== 'production') {
  console.log(chalk.red('Build is not running in optimized mode!'));
  process.exit(1);
}

// Begin the build process \o/
measureFileSizesBeforeBuild(PATHS.dist).then((previousFileSizes) => {
  prepareForNewBuild();
  build(previousFileSizes);
}).catch(error => processErrors('Preparation for build failed.', [error]));
