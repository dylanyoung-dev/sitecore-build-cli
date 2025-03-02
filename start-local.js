const { exec } = require('child_process');

exec('npm link', (err, stdout, stderr) => {
  if (err) {
    console.error(`Error linking npm package: ${stderr}`);
    process.exit(1);
  }
  console.log(stdout);
  exec('node dist/index.js', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error starting application: ${stderr}`);
      process.exit(1);
    }
    console.log(stdout);
  });
});