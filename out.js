const figlet = require('figlet');
const chalk = require('chalk');

//FUNCIONES PARA DAR FORMATO AL TEXTO
const colorize = (msg, color) => {
	if (typeof color !== "undefined"){
		msg = chalk[color].bold(msg);
	}
	return msg;
};

const log = (msg, color) => {
	console.log(colorize(msg, color));
};

const biglog = (msg, color) => {
	log(figlet.textSync(msg, {horizontalLayout: 'full'}), color);
};

const errorlog = (emsg) => {
	console.log(`${colorize("Error", "red")}: ${colorize(colorize(emsg, "red"), "bgYellowBright")}`);
};

//Conéxión con main.js (comparar con la forma de hacerlo de model.js)
exports = module.exports = {
	colorize,
	log,
	biglog,
	errorlog
};