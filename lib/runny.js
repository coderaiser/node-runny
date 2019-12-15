'use strict';

const itchy = require('itchy');
const currify = require('currify');
const {EventEmitter} = require('events');
const spawnify = require('spawnify');

module.exports = (cmd, directories) => {
    const emitter = new EventEmitter();
    
    check(cmd, directories);
    
    const fn = currify(run, emitter, cmd);
    
    process.nextTick(() => {
        itchy(directories, fn, () => {
            emitter.emit('exit');
        });
    });
    
    return emitter;
};

function run(emitter, cmd, cwd, callback) {
    const spawn = spawnify(cmd, {
        cwd,
    });
    
    spawn.on('error', (error) => {
        emitter.emit('error', error);
    });
    
    spawn.on('data', (data) => {
        emitter.emit('data', data);
    });
    
    spawn.on('exit', () => {
        callback();
    });
}

function check(cmd, directories) {
    if (typeof cmd !== 'string')
        throw Error('cmd should be string!');
    
    if (!Array.isArray(directories))
        throw Error('directories should be array!');
}

