const names = require('all-the-package-names');
const fs = require('fs');
const path = require('path');
const split = require('just-split');

const { getPkgJsonData, stringify } = require('./utils');

const PRETTY_PRINT_PACKAGE_JSON =
  ['yes', '1', 'y', 'true'].includes(process.env.PRETTY_PRINT_PACKAGE_JSON) ||
  false;

const groups = split(names, 800);

const LIB = path.join(__dirname, '../lib/');
if (fs.existsSync(LIB)) fs.rmSync(LIB, { recursive: true });

for (let i = 0; i < groups.length; i++) {
  const chunk = `chunk-${i}`;

  const packageName = `@everything-registry/${chunk}`;
  const packageDir = path.join(LIB, chunk);

  fs.mkdirSync(packageDir, { recursive: true });

  const pkgJson = stringify(
    {
      name: packageName,
      version: require('../package.json').versions.scoped,
      ...getPkgJsonData(packageName),
      repository: {
        type: 'git',
        url: 'git+https://github.com/everything-registry/everything.git',
        directory: `lib/${chunk}`,
      },
      dependencies: groups[i].reduce((acc, curr) => {
        acc[curr] = '*';
        return acc;
      }, {}),
    },
    PRETTY_PRINT_PACKAGE_JSON,
  );
  fs.writeFileSync(path.join(packageDir, 'package.json'), pkgJson);
  fs.writeFileSync(
    path.join(packageDir, 'index.js'),
    `console.log('Beep boop!');`,
  );
}

const everythingPackageDir = path.join(LIB, 'everything');
fs.mkdirSync(everythingPackageDir, { recursive: true });
const everythingPackageName = `everything`;

const everythingPkgJson = stringify(
  {
    name: everythingPackageName,
    version: require('../package.json').versions.main,
    ...getPkgJsonData(everythingPackageName),
    repository: {
      type: 'git',
      url: 'git+https://github.com/everything-registry/everything.git',
    },
    dependencies: groups.reduce((acc, curr, i) => {
      acc[`@everything-registry/chunk-${i}`] =
        require('../package.json').versions.scoped;
      return acc;
    }, {}),
  },
  PRETTY_PRINT_PACKAGE_JSON,
);

fs.writeFileSync(
  path.join(everythingPackageDir, 'package.json'),
  everythingPkgJson,
);
fs.writeFileSync(
  path.join(everythingPackageDir, 'index.js'),
  "console.log('You have installed everything... but at what cost?');",
);
