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

exports.playCmd = rl => {	//Va preguntando los quizzes hasta que se falle en uno
	let score = 0; //Almacena el número de preguntas que se han ido acertando
	let toBeResolved = []; //id's de las preguntas que me quedan por contestar

	for (id = 0; id < model.count() ; id++){
		toBeResolved[id] = id;	//meto los id's de todas las preguntas
	}

	const playOne = () => {
		if (toBeResolved.length === 0){
			biglog('ENHORABUENA', 'green');
			rl.prompt();
		} else {
			let id_preguntar = Math.floor(Math.random() * toBeResolved.length);
			let quiz = model.getByIndex(toBeResolved[id_preguntar]); 
			rl.question(colorize(`¿${quiz.question}? `, 'red'), respuesta => {
				if (respuesta === quiz.answer){
					score ++;
					biglog('Correcta', 'green');
					log(`Lleva acertadas ${score} preguntas`);
					toBeResolved.splice(id_preguntar,1);
					playOne();
				} else {
					biglog('Incorrecta', 'red');
					log(`Puntuación final: ${score} aciertos`);
					rl.prompt();
				}
			})
		}
	}
	
	playOne();
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