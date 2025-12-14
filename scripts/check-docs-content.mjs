import {promises as fs} from 'fs';
import path from 'path';

const docsRoot = path.join(process.cwd(), 'docs');

async function collectIndexFiles(root, relativeBase = '') {
  const entries = await fs.readdir(root, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    const absPath = path.join(root, entry.name);
    const relPath = path.join(relativeBase, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectIndexFiles(absPath, relPath);
      files.push(...nested);
    } else if (entry.isFile() && entry.name === 'index.md') {
      files.push({absPath, relPath});
    }
  }

  return files;
}

async function main() {
  const errors = [];

  try {
    await fs.access(docsRoot);
  } catch {
    console.error(`Docs root not found at ${docsRoot}`);
    process.exit(1);
  }

  const indexFiles = await collectIndexFiles(docsRoot);

  for (const file of indexFiles) {
    const content = await fs.readFile(file.absPath, 'utf8');
    const hasFrontmatter = /^---\s*\n[\s\S]*?\n---\s*\n/m.test(content);
    const hasH1 = /^#\s+.+/m.test(content);

    if (!hasFrontmatter) {
      errors.push(`${file.relPath}: missing frontmatter block (---)`);
    }
    if (!hasH1) {
      errors.push(`${file.relPath}: missing Markdown H1 heading`);
    }
  }

  if (errors.length) {
    console.error('Docs content check failed:');
    for (const message of errors) {
      console.error(`- ${message}`);
    }
    process.exit(1);
  }

  console.log('Docs content check passed.');
}

main().catch((error) => {
  console.error('Docs content check encountered an unexpected error:', error);
  process.exit(1);
});
