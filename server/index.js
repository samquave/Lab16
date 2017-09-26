var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'chirperuser',
    password: 'chirppass',
    database: 'Chirper'
});




var clientPath = path.join(__dirname, '../client');
var dataPath = (path.join(__dirname, 'data.json'));
var app = express();
app.use(express.static(clientPath));

app.use(bodyParser.json());






app.route('/api/chirps')
    .get(function (req, res) {
        getChirps()
            .then(function (chirps) {
                res.send(chirps);
            }), function (err) {
                res.status(500).send(err);
            }



    }).post(function (req, res) {
        writeChirp(req.body.message, req.body.user, req.body.timestamp)
            .then(function () {
                res.send();
            }), function (err) {
                res.status(500).send(err);
            }

    }).delete(function (req, res) {
        deleteChirp(req.body.id)
            .then(function () {
                res.send();
            }), function (err) {
                res.status(500).send(err);
            }
    })



app.listen(3000);



function getChirps() {
    return new Promise(function (fulfill, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query("CALL GetAllChirps();", function (err, resultsets) {
                    if (err) {
                        connection.release();
                        reject(err);
                    } else {
                        connection.release();
                        fulfill(resultsets[0]);
                    }
                });
            }
        });
    });
}

function writeChirp(messageVal, userVal, timestampVal) {
    return new Promise(function (fulfill, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query("CALL InsertChirp(?, ?, ?);", [messageVal, userVal, timestampVal], function (err, resultsets) {
                    if (err) {
                        connection.release();
                        reject(err);
                    } else {
                        connection.release();
                        fulfill(resultsets[0]);
                    }
                });
            }
        });
    });
}

function deleteChirp(idVal) {
    return new Promise(function (fulfill, reject) {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err);
            } else {
                connection.query("CALL DeleteChirp(?);", [idVal], function (err, resultsets) {
                    if (err) {
                        connection.release();
                        reject(err);
                    } else {
                        connection.release();
                        fulfill(resultsets[0]);
                    }
                });
            }
        });
    });
}