#!/usr/bin/env node

const { program } = require('commander');

const init = require('./commands/init')
program
    .command('init')
    .description(`Initilize your package`)
    .action(init)
;


const publish = require('./commands/publish')
program
    .command('publish')
    .description(`Publish your project to OPM registry`)
    .action(publish)
;




program.parse()