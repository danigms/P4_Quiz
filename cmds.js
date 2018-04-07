const {log, biglog, errorlog, colorize} = require("./out"); //Importo las funciones de out.js requeridas en vez del módulo entero
const {models} = require('./model'); //Importo
const Sequelize = require('sequelize');

//FUNCIONES DE LAS ACCIONES POSIBLES
exports.helpCmd = (socket, rl) => {
    log(socket, "Comandos:");
    log(socket, "h|help - Muestra esta ayuda.");
    log(socket, "list - Listar los quizzes existentes.");
    log(socket, "show <id> - Muestra la pregunta y la respuesta blabla."); //CAMBIAR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    log(socket, "add - Añadir un nuevo quiz interactivamente.");
    log(socket, "delete <id> - Borrar el quiz indicado.");
    log(socket, "edit <id> - Editar el quiz indicado.");
    log(socket, "test <id> - Probar el quiz indicado.");
    log(socket, "p|play -Jugar a preguntar aleatoriamente todos los quizzes.");
    log(socket, "credits - Créditos.");
    log(socket, "q|quit - Salir del programa.");
    rl.prompt();
};

const makeQuestion = (rl, text) => {
    return new Promise((resolve, reject) => {
        rl.question(colorize(text, 'red'), answer => {
            resolve(answer.trim());
        });
    });
};

exports.addCmd = (socket, rl) => {
    makeQuestion(rl, 'Introduzca una pregunta: ')
        .then(q => {  //texto de la pregunta: q
            return makeQuestion(rl, 'Introduzca la respuesta ')
                .then(a => { //texto de la respuesta: a, OJO!! Esta promesa va dentro de la anterior, no encadenada al mismo nivel
                    return {question: q, answer: a}; //construyo un quiz (?)
                });
        })
        .then(quiz => { //el quiz es lo que me ha devuelto la promesa then anterior
            return models.quiz.create(quiz);
        })
        .then((quiz) => {
            log(`${colorize('Se ha añadido', 'magenta')}: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        })
        .catch(Sequelize.ValidationError, error => {
            errorlog('El quiz es erróneo:');
            error.errors.forEach(({message}) => errorlog(message)); //array con todos los errores que ha habido
        })
        .catch(error => {
            errorlog(error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

exports.listCmd = (socket, rl) => {
    models.quiz.findAll() //findAll me devuelve el array quizzes
        .each(quiz => {
            log(socket, `[${colorize(quiz.id, 'magenta')}]: ${quiz.question}`);
        })
        /* OTRA FORMA DE HACERLO SIN UTILIZAR .each
        .then(quizzes => {
            quizzes.forEach((quiz) => {
                log(`[${colorize(quiz.id,'magenta')}]: ${quiz.question}`);
            });
        })*/
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        });

};

const validateId = (id) => {
    return new Sequelize.Promise((resolve, reject) => {
        if (typeof id === "undefined") {
            reject(new Error(`Falta el parámetro <id>.`));
        } else {
            id = parseInt(id); //cojo la parte entera y descarto lo demás
            if (Number.isNaN(id)) {
                reject(new Error(`El valor del parámetro <id> no es u número.`));
            } else {
                resolve(id);
            }
        }
    });
};

exports.showCmd = (socket, rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe ningún quiz asociado al id ${id}.`);
            } else {
                log(socket, `[${colorize(quiz.id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
            }
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        })
};

exports.testCmd = (socket, rl, id) => {  //QUEDA MEJORARLO PARA QUE ADMITA MAYÚSCULAS, MINÚSCULAS Y ESPACIOS
    validateId(id)
        .then(id => models.quiz.findById(id))
        .then(quiz => {
            if (!quiz) {
                throw new Error(`No existe ningún quiz asociado al id ${id}.`);
            } else {
                makeQuestion(rl, ` ${quiz.question} `)
                    .then(a => {
                        if (a === quiz.answer) {
                            biglog(socket, 'Correcta', 'green');
                        } else {
                            biglog(socket, 'Incorrecta', 'red');
                        }
                        rl.prompt();
                    })
            }
        })
    // .catch(error => {
    //     errorlog(error.message);
    // })
    // .then(() => {
    //     rl.prompt();
    // })

};

exports.playCmd = (socket, rl) => {	//Va preguntando los quizzes hasta que se falle en uno
    let score = 0; //Almacena el número de preguntas que se han ido acertando
    let toBeResolved = []; //id's de las preguntas que me quedan por contestar
    let ids_restantes = models.quiz.count;

    models.quiz.findAll()
        .then(quizzes => {
            toBeResolved = quizzes;
            // quizzes.forEach((quiz) => { //investigar por qué no sale con .each
            //     toBeResolved[quiz.id - 1] = quiz.id; //ESTO ERA EL PROBLEMA!!!!!!!!!!!!!!!!!!
            // });
        })
        .then(() => {
            return playOne();
        })
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        })

    const playOne = () => {
        return new Promise((resolve, reject) => {
            if (toBeResolved.length === 0) {
                biglog(socket, 'ENHORABUENA', 'green');
                resolve();
            } else {
                let id_preguntar = Math.floor(Math.random() * toBeResolved.length);
                quiz = toBeResolved[id_preguntar];
                // let quiz = models.quiz.findById(id_preguntar); //ESTO ERA EL PROBLEMA!!!!!!!!!!!!!!!!!!

                return makeQuestion(rl, `¿${quiz.question}? `)
                    .then(respuesta => {
                        if (respuesta.toLowerCase() === quiz.answer.toLowerCase()) {
                            score++;
                            biglog(socket, 'Correcta', 'green');
                            log(socket, `Lleva acertadas ${score} preguntas`);
                            toBeResolved.splice(id_preguntar, 1);
                            resolve(playOne());
                        } else {
                            biglog(socket, 'Incorrecta', 'red');
                            log(socket, `Puntuación final: ${score} aciertos`);
                            resolve();
                        }
                    });
            }
        });
    };
};

exports.deleteCmd = (socket, rl, id) => {
    validateId(id)
        .then(id => models.quiz.destroy({where: {id}}))
        .catch(error => {
            errorlog(socket, error.message);
        })
        .then(() => {
            rl.prompt();
        });
};

exports.editCmd = (socket, rl, id) => {
    validateId(id)
        .then(id => models.quiz.findById((id))
            .then(quiz => {
                if (!quiz) {
                    throw new Error(`No existe un quiz asociado al id ${id}.`);
                }
                process.stdout.isTTY && setTimeout(() => {
                    rl.write(quiz.question)
                }, 0);
                then(q => {
                    process.stdout.isTTY && setTimeout(() => {
                        rl.write(quiz.answer)
                    }, 0);
                    return makeQuestion(rl, 'Introduzca la respuesta')
                        .then(a => {
                            quiz.question = q;
                            quiz.answer = a;
                            return quiz;
                        });
                });
            })
            .then(quiz => {
                return quiz.save();
            })
            .then(quiz => {
                log(socket, `Se ha cambiado el quiz ${colorize(id, 'magenta')} por : ${question} => ${answer}`);
            })
            .catch(error => {
                errorlog(socket, error.message);
            })
            .then(() => {
                rl.prompt();
            }));
};

exports.creditsCmd = (socket, rl) => {
    log(socket, 'Autor de la práctica:');
    log(socket, 'Daniel Sánchez García-Monge', 'green');
    rl.prompt();
};

exports.quitCmd = rl => {
    rl.close();
    socket.end();
};