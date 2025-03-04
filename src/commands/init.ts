import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import simpleGit from 'simple-git';
import ora from 'ora'; // Add ora for better UI
import { promisify } from 'util';
import { ncp } from 'ncp';

const copy = promisify(ncp);

export async function init() {
  console.log('Initializing Sitecore CLI AI configuration');

  const rootDir = process.cwd();
  const files = fs.readdirSync(rootDir);

  const allowedFiles = ['.gitignore', 'README.md', 'sitecore-ai.config.json'];

  const configFilePath = path.join(rootDir, 'sitecore-ai.config.json');
  const configContent = `
# Sitecore CLI AI Configuration
SITECORE_XM_CLOUD_GRAPHQL_API_KEY=
OPEN_AI_KEY=
JIRA_EMAIL=""
JIRA_API_TOKEN="XXXXXXXXXXXXXX"
JIRA_DOMAIN="xxxxx.atlassian.net"
`;

  if (fs.existsSync(configFilePath)) {
    console.log('.sitecore-cli-config file already exists.');
  } else {
    fs.writeFileSync(configFilePath, configContent.trim());
    console.log('.sitecore-cli-config file created successfully.');
  }

  if (
    files.length === 0 ||
    files.every((file) => allowedFiles.includes(file))
  ) {
    const { cloneRepo } = await inquirer.prompt({
      type: 'confirm',
      name: 'cloneRepo',
      message:
        'The folder is empty or contains only allowed files. Do you want to get started with the Foundation Head repo?',
      default: true,
    });

    if (cloneRepo) {
      const git = simpleGit();
      const repoUrl = 'https://github.com/sitecorelabs/xmcloud-foundation-head';
      const tempDir = path.join(rootDir, 'temp-clone');
      const spinner = ora(`Cloning ${repoUrl} into ${tempDir}...`).start(); // Start spinner
      try {
        await git.clone(repoUrl, tempDir);
        await copy(tempDir, rootDir);
        fs.rmdirSync(tempDir, { recursive: true });
        spinner.succeed('Repository cloned successfully.');
      } catch (error) {
        spinner.fail('Failed to clone repository.');
        console.error(error);
        return; // Stop execution if cloning fails
      }
    }
  }

  // Check for additional actions in .sitecore-ai-cli folder
  const actionsDir = path.join(rootDir, '.sitecore-ai-cli');
  const commandsConfigPath = path.join(actionsDir, 'commands.json');

  if (fs.existsSync(commandsConfigPath)) {
    const commandsConfig = JSON.parse(
      fs.readFileSync(commandsConfigPath, 'utf-8'),
    );
    const { commands } = commandsConfig;

    for (const commandConfig of commands) {
      const { file: commandFile, params } = commandConfig;
      const commandPath = path.join(actionsDir, commandFile);
      console.log(`Executing additional command: ${commandFile}`);
      try {
        const command = require(commandPath);
        if (typeof command === 'function') {
          let commandParams = {};
          if (params && params.prompt) {
            commandParams = await inquirer.prompt(params.prompt);
          }
          await command(commandParams);
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
  }
}
