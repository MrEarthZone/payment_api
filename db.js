var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://admin:1234@ds151259.mlab.com:51259/payment_soa';
var db;
MongoClient.connect(url, function (err, database) {
    if (err) throw err;
    db = database.db('payment_soa');
    console.log("Connected to " + url);
});

function insertUser(req, res) {
    if (req.body.userId == undefined || req.body.userName == undefined) {
        res.status(400).json();
    }
    else {
        db.collection("user").find({ "userId": req.body.userId }).toArray(function (err, result) {
            if (err) throw err;
            if (result[0] == null) {
                var insert = {
                    "userId": req.body.userId,
                    "userName": req.body.userName,
                    "balance": 0
                };
                db.collection("user").insertOne(insert, function (err, result) {
                    if (err) throw err;
                    res.json(result.ops);
                });
            }
            else {
                res.send('This user id is taken.');
            }
        });
    }
};

function insertPayment(req, res) {
    var userId = req.body.userId;
    var orderId = req.body.orderId;
    var webName = req.body.webName;
    var price = req.body.price;
    db.collection("user").find({ "userId": userId }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0] == null) {
            res.status(404).json();
        }
        else {
            if (userId == undefined || orderId == undefined || webName == undefined || price == undefined) {
                res.status(400).json();
            }
            else {
                var insert = {
                    "userId": userId,
                    "orderId": orderId,
                    "webName": webName,
                    "price": price,
                    "date" : Date
                };
                db.collection("user").find({ "userId": userId }).toArray(function (err, result) {
                    if (result[0].balance < price) {
                        res.send('balance not enough');
                    }
                    else {
                        db.collection("payment").insertOne(insert, function (err, result) {
                            res.json(result.ops);
                        });
                        balance = result[0].balance - price;
                        db.collection("user").updateOne({ "userId": userId }, { $set: { "balance": balance } }, function (err, result) {
                        });
                    }
                });
            }
        }
    });
};

function findAllUser(req, res) {
    db.collection("user").find({}).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    });
};

function findAllPayment(req, res) {
    db.collection("payment").find({}).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    });
};

function findPaymentByUserId(req, res) {
    var userId = req.params.userId
    db.collection("payment").find({ "userId": userId }).toArray(function (err, result) {
        if (err) throw err;
        res.json(result);
    });
};

function findUser(req, res) {
    var userId = req.params.userId
    db.collection("user").find({ "userId": userId }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0] == null) {
            res.status(404).json();
        }
        else {
            res.json(result);
        }
    });
};

function increaseBalance(req, res) {
    var userId = req.params.userId
    var amount = req.params.amount
    db.collection("user").find({ "userId": userId }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0] == null) {
            res.status(404).json();
        }
        else {
            amount = + parseInt(amount) + result[0].balance
            db.collection("user").updateOne({ "userId": userId }, { $set: { "balance": amount } }, function (err, result) {
                if (err) throw err;
                db.collection("user").find({ "userId": userId }).toArray(function (err, result) {
                    if (err) throw err;
                    if (result[0] == null) {
                        res.status(404).json();
                    }
                    else {
                        res.json(result);
                    }
                });
            });
        };
    });
}

module.exports = {
    insertUser: insertUser,
    insertPayment: insertPayment,
    findAllUser: findAllUser,
    findAllPayment: findAllPayment,
    findUser: findUser,
    findPaymentByUserId: findPaymentByUserId,
    increaseBalance: increaseBalance
};