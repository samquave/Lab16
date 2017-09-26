var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: ''
})




var clientPath = path.join(__dirname, '../client');
var dataPath = (path.join(__dirname, 'data.json'));
var app = express();
app.use(express.static(clientPath));

app.use(bodyParser.json());






app.route('/api/chirps')
    .get(function (req, res) {

        res.sendFile(dataPath);

    }).post(function (req, res) {
        var newChirp = req.body;
        readFile(dataPath, 'utf8')
            .then(function (fileContents) {

                var chirps = JSON.parse(fileContents);

                chirps.push(newChirp);
                return writeFile(dataPath, JSON.stringify(chirps));

            }).then(function () {
                res.sendStatus(201);
            }).catch(function (err) {
                console.log(err);
                res.sendStatus(500);
            });

    });



app.listen(3000);

function readFile(filePath, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, encoding, function (err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

function writeFile(filePath, data) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filePath, data, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve();
            }
        });
    });
}