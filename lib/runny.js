'use strict';

const eachSeries = require('async/eachSeries');
const currify = require('currify/legacy');
const EventEmitter = require('events').EventEmitter;
const spawnify = require('spawnify');

module.exports = (cmd, directories) => {
    const emitter = new EventEmitter();
    
    check(cmd, directories);
    
    const fn = currify(run, emitter, cmd);
    
    process.nextTick(() => {
        eachSeries(directories, fn, () => {
            emitter.emit('exit');
        });
    });
    
    return emitter;
};

function run(emitter, cmd, dir, callback) {
    const spawn = spawnify(cmd, {
        cwd: dir
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

