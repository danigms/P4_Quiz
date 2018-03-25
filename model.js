//MODELO DE DATOS
const fs = require("fs");
const DB_FILENAME = "quizzes.json"; //fichero en la carpeta /quiz

let quizzes = [
	{question: "Capital de Italia", answer: "Roma"},
	{question: "Capital de Francia", answer: "París"},
	{question: "Capital de España", answer: "Madrid"},
	{question: "Capital de Portugal", answer: "Lisboa"}
];


const load = () => {
	fs.readFile(DB_FILENAME, (err, data) => {
		if(err){
			if(err.code === "ENOENT"){ //La primera vez no existe el fichero
				save(); //valores iniciales
				return;
			}
			throw err;
		}
		let json = JSON.parse(data);
		if (json){
			quizzes = json;
		}
	})
}

const save = () => { //Guarda quizzes actualizado
	fs.writeFile(DB_FILENAME, JSON.stringify(quizzes), err => {if(err) throw err;});
};


exports.count = () => quizzes.length;

exports.add = (question, answer) => {
	quizzes.push(
		{question: (question || "").trim(), answer: (answer || "").trim()}
	);
	save();
};

exports.update = (id, question, answer) => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error ('El valor del parámetro id no es válido'); //COMAS RARAS
	}
	quizzes.splice(
		id, 1, {question: (question || "").trim(), answer: (answer || "").trim()}
	);
	save();
};

/*convierto el objeto javascript quizzes en string, y lo parseo (lo vuelvo a convertir en objeto), 
es como que no puedo sacar quizzes directamente y necesito copiarlo para sacarlo*/
exports.getAll = () => JSON.parse(JSON.stringify(quizzes)); 

exports.getByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error ('El valor del parámetro id no es válido'); //COMAS RARAS
	}
	return JSON.parse(JSON.stringify(quiz));
};

exports.deleteByIndex = id => {
	const quiz = quizzes[id];
	if (typeof quiz === "undefined"){
		throw new Error ('El valor del parámetro id no es válido'); //COMAS RARAS
	}
	quizzes.splice(id, 1);
	save();
};


load();