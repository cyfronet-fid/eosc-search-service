const path = require('path');
const {writeFileSync} = require("fs");

const version = require('child_process')
  .execSync('git describe --tags --abbrev=0')
  ?.toString()?.trim();
const revision = require('child_process')
  .execSync('git rev-parse HEAD')
  ?.toString()?.trim();

if (!revision || !version) {
  throw Error('App build require Git and Fetched data from branch.');
}

// write the latest version
const newVersionEnvironment = `export const versionEnvironment = {
  version: '${version}',
  latestRevision: '${revision}',
};`;
const destinationVersionFilePath = path.join(__dirname, './apps/ui/src/environments/environment.version.ts');
writeFileSync(destinationVersionFilePath, newVersionEnvironment);
