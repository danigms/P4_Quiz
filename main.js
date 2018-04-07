const readline = require('readline');
const {log, biglog, errorlog, colorize} = require("./out"); //Importo las funciones de out.js requeridas en vez del módulo entero
const cmds = require("./cmds"); //Importo el módulo cmds.js entero
const net = require("net");

net.createServer(socket => {

    console.log("Se ha conectado un cliente desde" + socket.remoteAddress);
    biglog(socket, 'CORE Quiz', 'green'); //Mensaje inicial

    const rl = readline.createInterface({
        input: socket,
        output: socket,
        prompt: colorize("quiz >", 'blue'), //palabreja de la consola
        completer: (line) => { //función de readline, la implemento para que complete los comandos al empezar a escribirlos
            const completions = 'h help add delete edit list test p play credits q quit'.split(' ');
            const hits = completions.filter((c) => c.startsWith(line));
            return [hits.length ? hits : completions, line]; // show all completions if none found
        }
    });

    socket
        .on("end", () => {
            rl.close();
        })
        .on("error", () => {
            rl.close();
        })

    rl.prompt();

    rl.on('line', (line) => {
        let args = line.split(" "); //Parto la línea por los espacios en blanco
        let cmd = args[0].toLowerCase().trim(); //Cojo primera palabra, args[0], en minusculas

        switch (cmd) {
            case '':
                rl.prompt();
                break;
            case 'help':
            case 'h':
                cmds.helpCmd(socket, rl);
                break;
            case 'quit':
            case 'q':
                cmds.quitCmd(socket, rl);
                break;
            case 'add':
                cmds.addCmd(socket, rl);
                break;
            case 'list':
                cmds.listCmd(socket, rl);
                break;
            case 'show':
                cmds.showCmd(socket, rl, args[1]);
                break;
            case 'test':
                cmds.testCmd(socket, rl, args[1]);
                break;
            case 'play':
            case 'p':
                cmds.playCmd(socket, rl);
                break;
            case 'delete':
                cmds.deleteCmd(socket, rl, args[1]);
                break;
            case 'edit':
                cmds.editCmd(socket, rl, args[1]);
                break;
            case 'credits':
                cmds.creditsCmd(socket, rl);
                break;
            default:
                console.log(socket, `Comando desconocido: '${colorize(cmd, 'red')}'`);
                console.log(socket, `Use ${colorize('help', 'green')} para ver todos los comandos disponibles.`);
                rl.prompt();
                break;
        }
    })
        .on('close', () => {
            console.log(socket, 'Adiós!');
            process.exit(0);
        });
})

    .listen(3030); //o bien vuelvo a poner net.listen(3030)
