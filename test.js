const path = require('path');
const fs = require('fs');
const exec = require('child_process').execSync;

const redirect = (error, stdout, stderr) => {
  console.log(`${stdout}`);
  if (error) {
    throw error;
  }
};

const packagesFolder = path.resolve(__dirname, './packages');

const packages = fs.readdirSync(packagesFolder);

packages.map(p => path.resolve(packagesFolder, p)).forEach(package => {
  exec(`cd "${package}" && npm install && npm run tsc`, { stdio: 'inherit' });
  exec(`npm run mocha -- "${package}"/src/**/*.spec.js`, { stdio: 'inherit' });
});
