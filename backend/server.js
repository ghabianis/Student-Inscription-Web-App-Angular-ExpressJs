const express = require('express');
const { json } = require('express/lib/response');
const mysql = require('mysql');
//npm install mysql dans le terminal puis création base sur mysql (wampserver)
const app = express();
const port = 3001;
var rn = require('random-number');
var options = {
  min:  0,
   max:  10000
, integer: true
}
 
// Définition de l'en-tête pour permettre l'accès depuis n'importe où
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connecté à la base de données MySQL');
});

app.use(express.json());
// app.get('/etudiants', (req, res) => {
//     db.query('SELECT * FROM etudiants', (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });
app.post('/test', (req, res) => {
    console.log(req.body);
    res.json({requestBody: req.body})  // <==== req.body will be a parsed JSON object
  })

// Route pour ajouter un nouvel étudiant à la table 'etudiants'
app.post('/add/etudiants', (req, res) => {
    let data = req.body; // JavaScript object containing the parsed JSON
    const name = data.name;
    const email = data.email;
    const classs = data.class;
    const sql = `INSERT INTO etudiants (name,email,class) VALUES("${name}","${email}","${classs}")`;
    
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Erreur lors de l'ajout de l'étudiant :", err.message);
            return;
        }
        console.log('Étudiant ajouté avec succès à la base de données');
    });
    res.send(data)
});

// app.get(`/etudiants/${id}`, (req, res) => {
//     db.query(`SELECT * FROM etudiants where id = ${id}`, (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

app.listen(port, () => {
    console.log(`
Serveur Express en cours d 'exécution sur le port ${port}`);
});