#!/usr/bin/env node

const readline = require('readline');
const {createFileInDir, fileExistsInDir} = require('../utils/files')
  
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
        });
    });
}


/**
 * The `init` function initializes a package by reading package information from the user, setting up
 * the entrypoint, generating a panguan.json file, and displaying a success message.
 */
async function init(){

    let defaultPanguanObject = {
        "name": "",
        "version": "1.0.0",
        "description": "",
        "entry_point": "install.sql",
        "author": "",
        "dependencies": {}
      };      

    console.log(`\nThis utility will walk you through creating a panguan.json file.\n`);
    console.log(`\nSee 'opm init -h' for definitive documentation on these fields and exactly what they do.\n`);
    console.log(`\nPress ^C at any time to quit.`);

    // check if the project already Initilized
    await fileExistsInDir('.', 'panguan.json')
    .then(exists => {
        if (exists) {
            console.log('ERRRO: Your project alread an OPM package');
            process.exit(-1);
        }
    })
    .catch(err => console.error('Error checking file:', err));

    // read the package informations from the user
    const packageName = await askQuestion('package name: ');
    const version = await askQuestion('package name: (1.0.0) ');
    const description = await askQuestion('description: ');
    const entryPoint = await askQuestion('entry point: (install.sql) ');
    const author = await askQuestion('author: ');

    if( packageName.trim() !== '')
        defaultPanguanObject.name = packageName;

    if( version.trim() !== '')
        defaultPanguanObject.version = version;

    if( description.trim() !== '')
        defaultPanguanObject.description = description;

    if( entryPoint.trim() !== '')
        defaultPanguanObject.entry_point = entryPoint;

    if( author.trim() !== '')
        defaultPanguanObject.author = author;


    // generate a panguan.json file at the root of the project
    createFileInDir('.', 'panguan.json', JSON.stringify(defaultPanguanObject, null, 4))
    .then(() => console.log('Your panguan.json file has been created!'))
    .catch(err => console.error('Error creating file:', err));
    
    
        
}

module.exports = init