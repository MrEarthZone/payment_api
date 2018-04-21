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

app.get('/api/payment', db.findAllPayment);
app.get('/api/user', db.findAllUser);
app.get('/api/user/:userId', db.findUser);
app.get('/api/payment/:userId', db.findPaymentByUserId);

app.post('/api/payment/new', db.insertPaymentBill);
app.post('/api/user/new', db.insertUser);

app.get('/api/balance/:userId/increase/:amount', db.increaseBalance);

app.listen(port);
console.log('Run on port:' + port);