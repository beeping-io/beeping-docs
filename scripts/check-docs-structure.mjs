import {promises as fs} from 'fs';
import path from 'path';

const docsRoot = path.join(process.cwd(), 'docs');
const requiredSections = [
  'introduction',
  'protocol',
  'beepbox',
  'sdk-android',
  'sdk-ios',
  'core',
  'examples',
  'community',
  'projects',
  'crowdfunding',
  'contact',
];

async function pathExists(targetPath, expectDirectory = false) {
  try {
    const stat = await fs.stat(targetPath);
    if (expectDirectory && !stat.isDirectory()) {
      return false;
    }
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

async function main() {
  const errors = [];

  if (!(await pathExists(docsRoot, true))) {
    console.error(`Missing docs directory at ${docsRoot}`);
    process.exit(1);
  }

  for (const section of requiredSections) {
    const sectionPath = path.join(docsRoot, section);
    const indexPath = path.join(sectionPath, 'index.md');

    if (!(await pathExists(sectionPath, true))) {
      errors.push(`Missing required section folder: ${path.relative(process.cwd(), sectionPath)}`);
      continue;
    }

    if (!(await pathExists(indexPath))) {
      errors.push(`Missing index.md in section: ${path.relative(process.cwd(), indexPath)}`);
    }
  }

  if (errors.length) {
    console.error('Docs structure check failed:');
    for (const message of errors) {
      console.error(`- ${message}`);
    }
    process.exit(1);
  }

  console.log('Docs structure check passed.');
}

main().catch((error) => {
  console.error('Docs structure check encountered an unexpected error:', error);
  process.exit(1);
});
