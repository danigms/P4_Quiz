const {log, biglog, errorlog, colorize} = require("./out"); //Importo las funciones de out.js requeridas en vez del módulo entero
const model = require('./model'); //Importo el módulo entero model.js

//FUNCIONES DE LAS ACCIONES POSIBLES
exports.helpCmd = rl => {
	log('Comandos:');
	log('h|help - Muestra esta ayuda.');
	log('list - Listar los quizzes existentes.');
	log('show <id> - Muestra la pregunta y la respuesta blabla.'); //CAMBIAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	log('add - Añadir un nuevo quiz interactivamente.');
	log('delete <id> - Borrar el quiz indicado.');
	log('edit <id> - Editar el quiz indicado.');
	log('test <id> - Probar el quiz indicado.');
	log('p|play -Jugar a preguntar aleatoriamente todos los quizzes.');
	log('credits - Créditos.');
	log('q|quit - Salir del programa.');
	rl.prompt();
};

exports.addCmd = rl => {
	rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
		rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
			model.add(question, answer);
			log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>','magenta')} ${answer}`);
			rl.prompt();
		});
	});
};

exports.listCmd = rl => {
	model.getAll().forEach((quiz, id) => {
		log(`[${colorize(id,'magenta')}]: ${quiz.question}`);
	});
	rl.prompt();
};

exports.showCmd = (rl, id) => {
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
	} else {
		try {
			const quiz = model.getByIndex(id); //leo la pregunta
			log(`[${colorize(id,'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch(error) {errorlog(error.message);}
	}
	rl.prompt();
};

exports.testCmd = (rl, id) => {  //QUEDA MEJORARLO PARA QUE ADMITA MAYÚSCULAS, MINÚSCULAS Y ESPACIOS
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
	} else {
		try {
			const quiz = model.getByIndex(id); //leo la pregunta
			rl.question(colorize(`${quiz.question}? `,'red'), answer => {
				log('Su respuesta es:');
				if(answer === quiz.answer){
					biglog('Correcta', 'green');
				} else {biglog('Incorrecta', 'red');}
				rl.prompt();
			});
		} catch(error) {errorlog(error.message);}
	}
	rl.prompt();
};

exports.playCmd = rl => {
	/*let score = 0
	let toBeResolved = [];

	for ()

	if (toBeResolved.length === 0){

	} else {
		let id = Math.random(); quitarla del array
		let quiz = model.getByIndex(id);
		rl.question(quiz.question, respuesta => {
			respuesta === quiz.answer
		})
	}*/
};

exports.deleteCmd = (rl, id) => {
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
	} else {
		try {
			model.deleteByIndex(id);
		} catch(error) {errorlog(error.message);}
	}
	rl.prompt();
};

exports.editCmd = (rl, id) => {
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {
			const quiz = model.getByIndex(id);
			process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)},0);
			
			rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
				
				process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)},0);

				rl.question(colorize('Introduzca la respuesta ', 'red'), answer => {
					model.update(id, question, answer);
					log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por : ${question} => ${answer}`); //USAR COLORIZE
					rl.prompt();
				});
			});
		} catch (error) {errorlog(error.message);}
	}
};

exports.creditsCmd = rl => {
	log('Autor de la práctica:');
	log('Daniel Sánchez García-Monge', 'green');
	rl.prompt();
};

exports.quitCmd = rl => {
	rl.close();
};