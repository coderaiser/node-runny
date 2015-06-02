# Runny

Run one command in a couple directories.

## Install

`npm i runny -g`

## How to use?

```
$ runny
Usage: runny [options]
Options:
  -h, --help          display this help and exit
  -v, --version       display version and exit
  -c, --command       command to run
  -d, --directories   directories, divided by ","
  --save              save config to file ~/.runny.json
  --save-here         save config to file ./runny.json
```

## Config

You could create file `.runny.json` in home directory,
or `runny.json` in current directory with fields:
```json
{
    "command": "pwd",
    "directories": [
        "~/one",
        "~/two",
        "~/three"
    ]
}
```

Data will be read before execution in next order (left is more important):

`command line -> ./runny.json -> ~/.runny.json`

## License

MIT
