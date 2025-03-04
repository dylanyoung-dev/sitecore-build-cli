import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';

export async function executeAdditionalActions(
  rootDir: string,
  command: string,
) {
  if (!rootDir || !command) {
    throw new Error('Both rootDir and command arguments are required.');
  }

  const actionsDir = path.join(rootDir, '.sitecore-build', command);
  const commandsConfigPath = path.join(actionsDir, 'commands.json');

  console.log(`rootDir: ${rootDir}`);
  console.log(`command: ${command}`);
  console.log(`actionsDir: ${actionsDir}`);
  console.log(`commandsConfigPath: ${commandsConfigPath}`);

  if (fs.existsSync(commandsConfigPath)) {
    const commandsConfig = JSON.parse(
      fs.readFileSync(commandsConfigPath, 'utf-8'),
    );
    const { commands } = commandsConfig;

    if (!Array.isArray(commands) || commands.length === 0) {
      console.warn('No commands found in commands.json');
      return;
    }

    for (const commandConfig of commands) {
      if (!commandConfig || !commandConfig.file) {
        console.warn('Invalid command configuration:', commandConfig);
        continue;
      }

      const { file: commandFile, params } = commandConfig;
      const commandPath = path.join(actionsDir, commandFile);
      console.log(`Executing additional command: ${commandFile}`);
      try {
        const commandModule = require(commandPath);
        if (typeof commandModule === 'function') {
          let commandParams = {};
          if (params && params.prompt) {
            commandParams = await inquirer.prompt(params.prompt);
          }
          await commandModule(commandParams);
        } else {
          console.warn(
            `Command file ${commandFile} does not export a function.`,
          );
        }
      } catch (error) {
        console.error(`Failed to execute command ${commandFile}:`, error);
        break; // Stop execution if any command fails
      }
    }
  } else {
    console.warn(`commands.json not found at path: ${commandsConfigPath}`);
  }
}
