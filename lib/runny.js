'use strict';

var eachSeries      = require('async/eachSeries'),
    currify         = require('currify'),
    EventEmitter    = require('events').EventEmitter,
    spawnify        = require('spawnify');

module.exports = function(cmd, directories) {
    var fn,
        emitter = new EventEmitter();
    
    check(cmd, directories);
    
    fn = currify(run, emitter, cmd);
    
    process.nextTick(function() {
        eachSeries(directories, fn, function() {
            emitter.emit('exit');
        });
    });
    
    return emitter;
};

function run(emitter, cmd, dir, callback) {
    var spawn = spawnify(cmd, {
        cwd: dir
    });
    
    spawn.on('error', function(error) {
        emitter.emit('error', error);
    });
    
    spawn.on('data', function(data) {
        emitter.emit('data', data);
    });
    
    spawn.on('exit', function() {
        callback();
    });
}

function check(cmd, directories) {
    if (typeof cmd !== 'string')
        throw Error('cmd should be string!');
    
    if (!Array.isArray(directories))
        throw Error('directories should be array!');
}

