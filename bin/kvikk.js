#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import path from 'node:path';
import fs from 'node:fs';

import ServerDevelopment from '../lib/server/server-dev.js';
import ServerProduction from '../lib/server/server-prod.js';
import build from '../lib/build/build.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const pkgJson = fs.readFileSync(path.join(currentDirectory, '../package.json'), 'utf-8');
const pkg = JSON.parse(pkgJson);

const program = new Command();

program.name('Kvikk.js').description('Kvikk.js application').version(pkg.version);

program
  .command('start')
  .description('Starts a Kvikk.js application in production mode')
  .action(async () => {
    const server = new ServerProduction();
    await server.start();
  });

program
  .command('dev')
  .description('Starts a Kvikk.js application in development mode')
  .action(async () => {
    const server = new ServerDevelopment();
    await server.start();
  });

program
  .command('build')
  .description('Build and prepare a Kvikk.js application for production')
  .action(async () => {
    await build();
  });

program.parse();
