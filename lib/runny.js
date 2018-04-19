'use strict';

const eachSeries = require('async/eachSeries');
const currify = require('currify/legacy');
const EventEmitter = require('events').EventEmitter;
const tryCatch = require('try-catch');
const {execSync} = require('child_process');

module.exports = (cmd, directories, fn) => {
    check(cmd, directories);
    
    const runny = currify(run, cmd);
    
    process.nextTick(() => {
        eachSeries(directories, runny, fn);
    });
};

function run(cmd, cwd, callback) {
    const stdio = [0, 1, 2, 'pipe'];
    const [e] = tryCatch(execSync, cmd, {cwd, stdio});
    
    callback(e);
}

function check(cmd, directories) {
    if (typeof cmd !== 'string')
        throw Error('cmd should be string!');
    
    if (!Array.isArray(directories))
        throw Error('directories should be array!');
}

