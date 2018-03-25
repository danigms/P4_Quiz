const readline = require('readline');
const {log, biglog, errorlog, colorize} = require("./out"); //Importo las funciones de out.js requeridas en vez del módulo entero
const cmds = require("./cmds"); //Importo el módulo cmds.js entero

biglog('CORE Quiz', 'green'); //Mensaje inicial

const rl = readline.createInterface(
	{
		input: process.stdin,
		output: process.stdout,
		prompt: colorize("quiz >", 'blue'), //palabreja de la consola
		completer: (line) => { //función de readline, la implemento para que complete los comandos al empezar a escribirlos
			const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
			const hits = completions.filter((c) => c.startsWith(line));
			return [hits.length ? hits : completions, line]; // show all completions if none found
		}
	}
);

rl.prompt(); 


rl

.on('line', (line) => {
	
	let args = line.split(" "); //Parto la línea por los espacios en blanco
	let cmd = args[0].toLowerCase().trim(); //Cojo primera palabra, args[0], en minusculas

	switch (cmd) {
    	case '':
    		rl.prompt();
    	break;
    	case 'help':
    	case 'h':
    		cmds.helpCmd(rl);
    		break;
    	case 'quit':
    	case 'q':
    		cmds.quitCmd(rl);
    		break;
    	case 'add':
    		cmds.addCmd(rl);
    		break;
    	case 'list':
    		cmds.listCmd(rl);
    		break;
    	case 'show':
    		cmds.showCmd(rl, args[1]);
    		break;
    	case 'test':
    		cmds.testCmd(rl, args[1]);
    		break;
    	case 'play':
    	case 'p':
    		cmds.playCmd(rl);
    		break;
    	case 'delete':
    		cmds.deleteCmd(rl, args[1]);
    		break;
    	case 'edit':
    		cmds.editCmd(rl, args[1]);
    		break;
    	case 'credits':
    		cmds.creditsCmd(rl);
    		break;
    	default:
    		console.log(`Comando desconocido: '${colorize(cmd, 'red')}'`);
    		console.log(`Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
    		rl.prompt();
      	break;
  	}
})

.on('close', () => {
	console.log('Adiós!');
	process.exit(0);
});