var express = require('express');
var app = express();
var db = require('./db.js');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
    res.send('Welcome to payment API');
});
app.get('/api/payment/all', db.findAllPayment);
app.get('/api/user/all', db.findAllUser);

app.post('/api/payment/new', db.insertPayment);
app.post('/api/user/new', db.insertUser);

app.listen(port);
console.log('Run on port:' + port);