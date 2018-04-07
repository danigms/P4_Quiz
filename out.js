const figlet = require('figlet');
const chalk = require('chalk');

//FUNCIONES PARA DAR FORMATO AL TEXTO
const colorize = (msg, color) => {
    if (typeof color !== "undefined") {
        msg = chalk[color].bold(msg);
    }
    return msg;
};

const log = (socket, msg, color) => {
    socket.write(colorize(msg, color));
};

const biglog = (socket, msg, color) => {
    log(socket, figlet.textSync(msg, {horizontalLayout: 'full'}), color);
};

const errorlog = (socket, emsg) => {
    socket.write(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}\n`);
};

//Conéxión con main.js (comparar con la forma de hacerlo de model.js)
exports = module.exports = {
    colorize,
    log,
    biglog,
    errorlog
};