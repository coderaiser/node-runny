#!/usr/bin/env node

'use strict';

const path = require('path');
const readjson = require('readjson');

const HOME = require('os').homedir();

const cwd = process.cwd();
const name = 'runny.json';
const current = path.join(cwd, name);
const home = path.join(HOME, '.' + name);

const options     =
    readjson.sync.try(current) ||
    readjson.sync.try(home)    ||
    {};

const argv = process.argv;
const args = require('minimist')(argv.slice(2), {
        string: [
            'command',
            'directories'
        ],
        boolean: [
            'version',
            'help',
            'save',
            'save-here'
        ],
        default: {
            'command': options.command,
            'directories': options.directories
        },
        alias: {
            v: 'version',
            h: 'help',
            c: 'command',
            d: 'directories'
        },
        unknown: (cmd) => {
            console.log('\'%s\' is not a runny option. See \'runny --help\'.', cmd);
            process.exit(-1);
        }
    });

if (args.version)
    version();
else
    start();

function start() {
    const runny = require('..');
    
    if (args.help)
        return help();
    
    if (!args.command)
        return console.error('command could not be empty!');
    
    if (!args.directories)
        return console.error('directories could not be empty!');
    
    const {command} = args;
    
    let directories;
    if (typeof args.directories === 'string')
        directories = args.directories.split(',');
    else
        directories = args.directories;
    
   runny(command, directories);
    
    let saveName;
    if (args['save-here'])
        saveName = current + '/.runny.json';
    else if (args.save)
        saveName = home + '/.runny.json';
    
    if (saveName) {
        const fs = require('fs');
        
        const json = JSON.stringify({
            command     : args.command,
            directories : args.directories
        }, null, 4);
        
        fs.writeFile(saveName, json, (error) => {
            console.error(error.message);
        });
    }
}

function version() {
    const pack = require('../package.json');
    
    console.log('v' + pack.version);
}

function help() {
    const currify = require('currify/legacy');
    const forEachKey = require('for-each-key');
    
    const bin = require('../json/bin');
    const usage = 'Usage: runny [options]';
    const log = currify((a, b, c) => console.log(a, b, c));
    
    console.log(usage);
    console.log('Options:');
    forEachKey(log(' %s %s'), bin);
}

