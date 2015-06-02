#!/usr/bin/env node

(function() {
    'use strict';
    
    var HOME_WIN    = process.env.HOMEPATH,
        HOME_UNIX   = process.env.HOME,
        
        HOME        = (HOME_UNIX || HOME_WIN) + '/',
        
        current     = process.cwd() + '/runny',
        home        = HOME + '/.runny',
        
        tryRequire  = require('tryrequire'),
        
        options     = 
            tryRequire(current) ||
            tryRequire(home)    ||
            {},
        
        argv        = process.argv,
        args        = require('minimist')(argv.slice(2), {
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
            unknown: function(cmd) {
                console.log('\'%s\' is not a runny option. See \'runny --help\'.', cmd);
                process.exit(-1);
            }
        });
    
    if (args.version)
        version();
    else
        start();
    
    function start() {
        var fs, json,
            saveName,
            command,
            directories,
            emitter,
            runny   = require('..');
        
        if (args.help) {
            help();
        } else if (!args.command) {
            console.error('command could not be empty!');
        } else if (!args.directories) {
            console.error('directories could not be empty!');
        } else {
            command = args.command;
            
            if (typeof args.directories === 'string')
                directories = args.directories.split(',');
            else
                directories = args.directories;
            
            emitter     = runny(command, directories);
            
            emitter.on('data', function(data) {
                console.log(data);
            });
            
            emitter.on('error', function(error) {
                console.error(error.message);
            });
            
            if (args['save-here'])
                saveName = current + '/.runny.json';
            else if (args.save)
                saveName = home + '/.runny.json';
            
            if (saveName) {
                fs      = require('fs');
                
                json    = JSON.stringify({
                    command     : args.command,
                    directories : args.directories
                }, null, 4);
                
                fs.writeFile(saveName, json, function(error) {
                    console.error(error.message);
                });
            }
        }
    }
    
    function version() {
        var pack = require('../package.json');
        
        console.log('v' + pack.version);
    }
    
     function help() {
        var bin         = require('../json/bin'),
            usage       = 'Usage: runny [options]';
        
        console.log(usage);
        console.log('Options:');
        
        Object.keys(bin).forEach(function(name) {
            console.log('  %s %s', name, bin[name]);
        });
    }
})();
