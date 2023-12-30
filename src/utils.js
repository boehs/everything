// global counter to keep track of package names
let packageNameCounter = 0;
const packageNamePrefix = 'Pkg';

// Function to group array elements into packages
function groupArrayElements(list, groupSize) {
  // Base case: if the list is small enough, return it as a single package
  if (list.length <= groupSize) {
    return [
      {
        packageName: packageNamePrefix + packageNameCounter++,
        items: list,
      },
    ];
  }

  let groupedPackages = [];

  // Split the list into smaller groups, each becoming a package
  while (list.length > 0) {
    let slice = list.splice(0, groupSize);
    groupedPackages.push({
      packageName: packageNamePrefix + packageNameCounter++,
      items: slice,
    });
  }

  // Recursive case: Group packages further if they exceed the group size
  if (groupedPackages.length > groupSize) {
    return groupArrayElements(groupedPackages, groupSize);
  }

  return groupedPackages;
}

// Helper function to walk through the package tree
function walkPackageTree(packageTree, callback) {
  packageTree.forEach((pkg) => {
    // Execute the callback on the current package
    callback(pkg);

    // If the package has items that are themselves packages, recursively walk through them
    if (pkg.items && pkg.items[0] && pkg.items[0].packageName) {
      walkPackageTree(pkg.items, callback);
    }
  });
}

function stringify(str, fancy) {
  return JSON.stringify(str, null, fancy ? 2 : 0);
}

function getFirstChar(name) {
  const initialChar = name.charAt(0).toLowerCase();

  return initialChar === '@'
    ? name.split('/')[1].charAt(0).toLowerCase()
    : initialChar;
}

function getPkgJsonData(packageName, scope) {
  return {
    description: `npm install ${packageName}`,
    main: 'index.js',
    contributors: [
      'PatrickJS <github@patrickjs.com>',
      'uncenter <hi@uncenter.dev>',
      'ChatGPT <chatgpt@openai.com>',
    ],
    scripts: {},
    keywords: [
      scope ? `everything-${scope}` : null,
      'everything',
      'allthethings',
      'everymodule',
    ].filter(Boolean),
    license: 'MIT',
    homepage: 'https://github.com/everything-registry/everything',
  };
}

module.exports = {
  stringify,
  getFirstChar,
  getPkgJsonData,
  groupArrayElements,
  walkPackageTree,
};
