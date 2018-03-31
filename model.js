//MODELO DE DATOS
const Sequelize = require('sequelize');
const sequelize = new Sequelize("sqlite:quizzes.sqlite", {logging: false}); //Objeto que voy a usar, con logging false para que no saque trazas al iniciar

sequelize.define('quiz', { //Defino el modelo de datos quiz
    question: {
        type: Sequelize.STRING,
        unique: {msg: "Ya existe esta pregunta"},
        validate: {notEmpty: {msg: "La pregunta no puede estar vacía"}}
    },
    answer: {
        type: Sequelize.STRING,
        validate: {notEmpty: {msg: "La pregunta no puede estar vacía"}}
    }
});

sequelize.sync() //Sincronizo, miro a ver si en la BBDD existen estas movidas, y si no las creo
    .then(() => sequelize.models.quiz.count()) //accede a la propiedad models de sequelize, al modelo quiz, y cuenta cuantos hay para pasárselo al siguiente then
    .then(count => {
        if (!count) { //caso de que sea 0
            return sequelize.models.quiz.bulkCreate([
                {question: "Capital de Italia", answer: "Roma"},
                {question: "Capital de Francia", answer: "París"},
                {question: "Capital de España", answer: "Madrid"},
                {question: "Capital de Portugal", answer: "Lisboa"}
            ]);
        }
    })
    .catch(error => {
        console.log(error);
    });
module.exports = sequelize;