function stringify(str, fancy) {
  return JSON.stringify(str, null, fancy ? 2 : 0);
}

function getPkgJsonData(packageName) {
  return {
    description: `npm install ${packageName}`,
    main: 'index.js',
    contributors: [
      'ChatGPT <chatgpt@openai.com>',
      'PatrickJS <github@patrickjs.com>',
      'uncenter <hi@uncenter.dev>',
      'trash <trash@trash.dev>',
      'Hacksore <sean@boult.me>',
      'boehs <evan@boehs.org>',
    ],
    scripts: {},
    keywords: ['everything', 'allthethings', 'everymodule'].filter(Boolean),
    license: 'MIT',
    homepage: 'https://github.com/everything-registry/everything',
  };
}

module.exports = {
  stringify,
  getPkgJsonData,
};
