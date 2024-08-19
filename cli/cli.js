#!/usr/bin/env node

const { program } = require('commander');

const publish = require('./commands/publish')
program
    .command('publish')
    .description(`Publish your project to OPM registry`)
    .action(publish)
;




program.parse()