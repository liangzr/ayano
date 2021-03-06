import fs from 'fs-extra';
import chalk from 'chalk';
import path from 'path';
const spawn = require('react-dev-utils/crossSpawn');
import { shouldUseYarn, shouldUseCNPM } from '../utls.js';
const useYarn = shouldUseYarn();
const useCNpm = shouldUseCNPM();

const buildScripts = () => ({
  start: 'ayano-script start',
  build: 'ayano-script build',
  publish: 'ayano-script publish'
})

const changePackageJson = (cwd) => {
  const packageJsonPath = path.join(cwd, 'package.json');
  const origin = require(packageJsonPath);
  const target = Object.assign({}, origin, {
    scripts: buildScripts()
  })
  fs.writeFileSync(packageJsonPath, JSON.stringify(target, null, 2))
  console.log(target)
}

const copyTemplate = (target) => {
  const templatePath = path.resolve(__dirname, '../../template')
  fs.copySync(templatePath, target);
}

const devDependencies = (options) => {
  return 'ayano-react';
  // return ['react-router', 'redux', 'react-redux', 'react-router-redux@next', 'react-router-dom', 'redux-thunk', 'redux-devtools-extension', 'axios'];
}

const installDependencies = () => {
  let command, args;
  if (useCNpm) {
    command = 'cnpm';
    args = ['install', '--save-dev'].filter(e => e);
  } else if (useYarn) {
    command = 'yarn';
    args = ['add', '--dev']
  } else {
    command = 'npm';
    args = ['install', '--save-dev'].filter(e => e);
  }
  args = args.concat(devDependencies());
  console.log(chalk.green(`find command ${command} available`));
  console.log(chalk.green(`exec command ${ command + " " + args.join(" ") }`));
  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    process.exit(1);
  }
}

module.exports = (options) => {
  const cwd = process.cwd();
  changePackageJson(cwd)
  copyTemplate(cwd);
  installDependencies();
};
