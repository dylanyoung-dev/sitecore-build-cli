#!/usr/bin/env node
import { readdirSync } from 'fs';
import { join } from 'path';
import { Command } from 'commander';
import { init } from './commands/init';
import { scaffoldComponent, scaffoldSite } from './commands/scaffold';

const program = new Command();

program
  .name('sitecore-build')
  .description('CLI for Sitecore Build')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize Sitecore CLI AI configuration')
  .action(init);

program
  .command('scaffold:component')
  .description('Scaffold a new component')
  .action(scaffoldComponent);

program
  .command('scaffold:site')
  .description('Scaffold a new site')
  .action(scaffoldSite);

program.parse(process.argv);
