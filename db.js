var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://admin:1234@ds151259.mlab.com:51259/payment_soa';
var db;
MongoClient.connect(url, function (err, database) {
    if (err) throw err;
    db = database.db('payment_soa');
    console.log("Connected to " + url);
});

function insertUser(req, res) {
    console.log(req.body);
    if (req.body.userId == undefined || req.body.userName == undefined) {
        res.status(400).json();
    }
    else {
        var insert = {
            "userId": req.body.userId,
            "userName": req.body.userName,
            "balance": "0"
        };
        db.collection("user").insertOne(insert, function (err, result) {
            if (err) throw err;
            res.json(result.ops);
        });
    }
};

function insertPayment(req, res) {
    if (req.body.userId == undefined || req.body.productId == undefined || req.body.webName == undefined || req.body.price == undefined || req.body.amount == undefined) {
        res.status(400).json();
    }
    else {
        var insert = {
            "userId": req.body.userId,
            "productId": req.body.productId,
            "webName": req.body.webName,
            "price": req.body.price,
            "amount": req.body.amount
        };
        db.collection("payment").insertOne(insert, function (err, result) {
            if (err) throw err;
            res.json(result.ops);
        });
    }
};

function findAllUser(req, res) {
    db.collection("user").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
};

function findAllPayment(req, res) {
    db.collection("payment").find({}).toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        res.json(result);
    });
};

module.exports = {
    insertUser: insertUser,
    insertPayment: insertPayment,
    findAllUser: findAllUser,
    findAllPayment:findAllPayment
};