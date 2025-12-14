import {promises as fs} from 'fs';
import path from 'path';

const docsRoot = path.join(process.cwd(), 'docs');
const esRoot = path.join(process.cwd(), 'i18n', 'es', 'docusaurus-plugin-content-docs', 'current');

async function collectMarkdownFiles(root, baseRel = '') {
  const entries = await fs.readdir(root, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absPath = path.join(root, entry.name);
    const relPath = path.join(baseRel, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectMarkdownFiles(absPath, relPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (entry.name === '_category_.json') continue;
      files.push({absPath, relPath});
    }
  }

  return files;
}

function routeFromRelative(relPath, localePrefix = '') {
  const parsed = path.parse(relPath);
  const segments = parsed.dir ? parsed.dir.split(path.sep).filter(Boolean) : [];
  if (parsed.name !== 'index') {
    segments.push(parsed.name);
  }
  const joined = segments.join('/');
  const base = localePrefix ? `/${localePrefix}/docs` : '/docs';
  return joined ? `${base}/${joined}` : base;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
}

async function main() {
  const errors = [];

  const enFiles = await collectMarkdownFiles(docsRoot);
  for (const file of enFiles) {
    const spanishPath = path.join(esRoot, file.relPath);
    const spanishRoute = routeFromRelative(file.relPath, 'es');

    if (!(await pathExists(spanishPath))) {
      errors.push(`${file.relPath}: missing Spanish counterpart at ${path.relative(process.cwd(), spanishPath)}`);
    }

    const content = await fs.readFile(file.absPath, 'utf8');
    if (!content.includes(spanishRoute)) {
      errors.push(`${file.relPath}: missing link to Spanish version (${spanishRoute})`);
    }
  }

  const esFiles = await collectMarkdownFiles(esRoot);
  for (const file of esFiles) {
    const englishPath = path.join(docsRoot, file.relPath);
    const englishRoute = routeFromRelative(file.relPath);

    if (!(await pathExists(englishPath))) {
      errors.push(`${file.relPath} (es): missing English source at ${path.relative(process.cwd(), englishPath)}`);
    }

    const content = await fs.readFile(file.absPath, 'utf8');
    if (!content.includes(englishRoute)) {
      errors.push(`${file.relPath} (es): missing link to English version (${englishRoute})`);
    }
  }

  if (errors.length) {
    console.error('Language link check failed:');
    for (const message of errors) {
      console.error(`- ${message}`);
    }
    process.exit(1);
  }

  console.log('Language link check passed.');
}

main().catch((error) => {
  console.error('Language link check encountered an unexpected error:', error);
  process.exit(1);
});
