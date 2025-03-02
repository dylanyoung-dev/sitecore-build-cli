import { readdirSync } from 'fs';
import { join } from 'path';

function main() {
  const rootDir = process.cwd();
  const files = readdirSync(rootDir);
  console.log(`Files in ${rootDir}:`, files);
}

if (require.main === module) {
  main();
}
