import {promises as fs} from 'fs';
import path from 'path';

const docsRoot = path.join(process.cwd(), 'docs');
const esRoot = path.join(process.cwd(), 'i18n', 'es', 'docusaurus-plugin-content-docs', 'current');

async function collectMarkdownFiles(root, relativeBase = '') {
  const entries = await fs.readdir(root, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absPath = path.join(root, entry.name);
    const relPath = path.join(relativeBase, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectMarkdownFiles(absPath, relPath);
      files.push(...nested);
    } else if (entry.isFile()) {
      if (entry.name === '_category_.json') continue;
      if (entry.name.endsWith('.md')) {
        files.push(relPath);
      }
    }
  }

  return files;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function main() {
  const missing = [];

  const sourceFiles = await collectMarkdownFiles(docsRoot);

  for (const relative of sourceFiles) {
    const targetPath = path.join(esRoot, relative);
    if (!(await pathExists(targetPath))) {
      missing.push(relative);
    }
  }

  if (missing.length) {
    console.error('Missing Spanish doc equivalents:');
    for (const file of missing) {
      console.error(`- ${path.join('i18n/es/docusaurus-plugin-content-docs/current', file)}`);
    }
    process.exit(1);
  }

  console.log('i18n check passed: Spanish docs mirror source structure.');
}

main().catch((error) => {
  console.error('i18n check encountered an unexpected error:', error);
  process.exit(1);
});
