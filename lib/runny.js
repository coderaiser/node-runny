(function() {
    'use strict';
    
    var async           = require('async'),
        EventEmitter    = require('events').EventEmitter,
        spawnify        = require('spawnify');
    
    module.exports = function(cmd, directories) {
        var fn,
            emitter = new EventEmitter();
        
        check(cmd, directories);
        
        fn = run.bind(null, emitter, cmd);
        
        async.eachSeries(directories, fn);
        
        return emitter;
    };
    
    function run(emitter, cmd, dir, callback) {
        var spawn = spawnify('cd ' + dir + '&& ' + cmd);
        
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
            throw(Error('cmd should be string!'));
        
        if (!Array.isArray(directories))
            throw(Error('directories should be array!'));
    }
    
})();