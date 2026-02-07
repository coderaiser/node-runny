import process from 'node:process';
import {EventEmitter} from 'node:events';
import itchy from 'itchy';
import currify from 'currify';
import spawnify from 'spawnify';

const isString = (a) => typeof a === 'string';

export const runny = (cmd, directories) => {
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
    if (!isString(cmd))
        throw Error('cmd should be string!');
    
    if (!Array.isArray(directories))
        throw Error('directories should be array!');
}
