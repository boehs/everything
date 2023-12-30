const names = require('all-the-package-names');
const fs = require('fs');
const path = require('path');
const split = require('just-split');

const { getPkgJsonData, stringify } = require('./utils');

const NPM_MAX_DEPS = 800;
const PRETTY_PRINT_PACKAGE_JSON = true;

const subgroups = split(names, NPM_MAX_DEPS);
const groups = split(subgroups, NPM_MAX_DEPS);

const LIB = path.join(__dirname, '../lib/');
if (fs.existsSync(LIB)) fs.rmSync(LIB, { recursive: true });

function writeChunk(name, deps) {
  const packageName = `@everything-registry/${name}`;
  const packageDir = path.join(LIB, name);

  fs.mkdirSync(packageDir, { recursive: true });

  const pkgJson = stringify(
    {
      name: packageName,
      version: require('../package.json').versions.scoped,
      ...getPkgJsonData(packageName),
      repository: {
        type: 'git',
        url: 'git+https://github.com/everything-registry/everything.git',
        directory: `lib/${name}`,
      },
      dependencies: deps.reduce((acc, curr) => {
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

for (let i = 0; i < groups.length; i++) {
  for (let j = 0; j < groups[i].length; j++) {
    writeChunk(`sub-chunk-${j + i * NPM_MAX_DEPS}`, groups[i][j]);
  }

  writeChunk(
    `chunk-${i}`,
    groups[i].reduce((acc, curr, k) => {
      acc.push(`@everything-registry/sub-chunk-${k + i * NPM_MAX_DEPS}`);
      return acc;
    }, []),
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
