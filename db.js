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
};

function insertPaymentBill(req, res) {
    var userId = req.body.userId;
    var productId = req.body.productId;
    var webName = req.body.webName;
    var price = req.body.price;
    var amount = req.body.amount;
    db.collection("user").find({ "userId": userId }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0] == null) {
            res.status(404).json();
        }
        else {
            if (userId == undefined || productId == undefined || webName == undefined || price == undefined || amount == undefined) {
                res.status(400).json();
            }
            else {
                var insert = {
                    "userId": userId,
                    "productId": productId,
                    "webName": webName,
                    "price": price,
                    "amount": amount
                };
                db.collection("payment").insertOne(insert, function (err, result) {
                    if (err) throw err;
                    payment(userId, price * amount);
                    res.json(result.ops);
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
                res.json(result);
            });
        };
    });
}

function payment(userId, amount) {
    db.collection("user").find({ "userId": userId }).toArray(function (err, result) {
        if (err) throw err;
        if (result[0].balance < amount) {
            res.send('balance not enough');
        }
        else {
            amount = result[0].balance - amount;
            db.collection("user").updateOne({ "userId": userId }, { $set: { "balance": amount } }, function (err, result) {
                if (err) throw err;
            });
        }
    });
}

module.exports = {
    insertUser: insertUser,
    insertPaymentBill: insertPaymentBill,
    findAllUser: findAllUser,
    findAllPayment: findAllPayment,
    findUser: findUser,
    findPaymentByUserId:findPaymentByUserId,
    increaseBalance: increaseBalance
};