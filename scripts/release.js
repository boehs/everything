const { readdirSync } = require('fs');
const { writeFile, readFile } = require('fs/promises');
const { join } = require('path');

async function publishDirectories() {
  const LIB_PATH = join(__dirname, '../lib/');
  const PACKAGES_JSON_PATH = join(__dirname, '../published.json');

  const { $ } = await import('execa');
  const PACKAGES = JSON.parse(await readFile(PACKAGES_JSON_PATH, 'utf-8'));

  process.chdir(LIB_PATH);

  const subdirectories = readdirSync('./', { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const dir of subdirectories) {
    try {
      process.chdir(join(LIB_PATH, dir));

      console.log(`Publishing directory ${dir}...`);

      await $({ stdio: 'inherit' })`cat package.json`;

      console.log(`Successfully published ${dir}!`);
      PACKAGES.push(dir);
      await writeFile(
        join(__dirname, '../published.json'),
        JSON.stringify(PACKAGES),
      );
    } catch (err) {
      console.error(`Oh no! Failed to publish ${dir}!`);
    } finally {
      process.chdir(LIB_PATH);
    }
  }
}

publishDirectories();
