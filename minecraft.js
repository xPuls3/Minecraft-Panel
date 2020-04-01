const spawn = require('child_process').spawn;
const fs = require("fs");

let minecraft = {};
let config = {};
let slave = null;
let port = 25565 - 1;

try {
    config = JSON.parse(fs.readFileSync("config.json"));
} catch (e) {
    console.error("Invalid JSON format in config.json");
    throw e;
}

let options = [];

if (!config.hasOwnProperty("file")) {
    console.error("No valid file provided in config.json");
    process.exit();
}

if (config.hasOwnProperty("memory")) {
    if (config.hasOwnProperty("min")) options.push(`-Xms${config.memory.min}`);
    if (config.hasOwnProperty("max")) options.push(`-Xmx${config.memory.min}`);
}

if (config.hasOwnProperty("autostart") && config.autostart === true) start();
if (config.hasOwnProperty("port")) port = config.port;

process.stdin.on('data', function (raw) {
    if (raw === "SIGINT") return;
    let command = raw.toString().toLowerCase();
    if (getState() && command === "restart\n") {
        stop().then(start);
    } else if (getState()) {
        slave.stdin.write(command + "\n");
    } else if (command.toString().toLowerCase() === "start\n") {
        start();
    }
});

process.on("SIGINT", function () {
    if (getState()) {
        slave.stdin.write("stop\n");
        slave.on('exit', function () {
            process.exit();
        });
    } else {
        process.exit();
    }
});

function start() {
    return new Promise(function (resolve) {
        if (slave == null) {

            slave = spawn("java", [...options, '-jar', config.file, 'nogui'], {cwd: '../'});
            slave.stdout.on("data", log);

            slave.on("exit", function () {
                console.log("Server stopped!");
                slave = null;
            });

            let pattern = new RegExp("^\\[\\d\\d:\\d\\d:\\d\\d]\\s*\\[.*]: Done", "gm");
            slave.stdout.on("data", function (data) {
                if (pattern.test(data)) resolve();
            });

        } else {
            resolve();
        }
    });
}

function stop() {
    return new Promise(function (resolve) {
        if (slave != null) {
            slave.stdin.write("stop\n");
            slave.on('exit', function () {
                slave = null;
                resolve();
            });
        } else {
            resolve();
        }
    });
}

function restart() {
    return new Promise(function (resolve) {
        stop().then(function () {
            start().then(resolve);
        })
    });
}

function getState() {
    return slave !== null;
}

function log(data) {
    process.stdout.write(data.toString());
}

minecraft.getState = getState;
minecraft.start = start;
minecraft.stop = stop;
minecraft.restart = restart;
minecraft.port = port;

module.exports = minecraft;