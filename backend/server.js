const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const paypal = require('paypal-rest-sdk');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors());

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARncKoDfj4vq7nC5OTOYN8js7oQwouyNRjaacprrVjip2jxwlN_DjDW58GgGuUq8HxPbVSHNr_LpKA4S',
    'client_secret': 'ELmjjtbU0j5GnBtGDyOZ2GjADKFFl30JPc3RJBzKVjDQ6QTQSrWLzJEXcPI0PIL4XvJcCn3fA8K7kjxf'
});

app.post('/pay', (req, res) => {

    let create_payment_json = {
        "intent": "authorize",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            for (let index = 0; index < payment.links.length; index++) {
                //Redirect user to this endpoint for redirect url
                if (payment.links[index].rel === 'approval_url') {
                    res.status(200).json({
                        status: 'Success',
                        link: payment.links[index].href
                    });
                }
            }
            console.log(payment);
        }
    });
});

app.get('/success', (req, res) => {
    let payerId = req.query.PayerID;
    let paymentId = req.query.paymentId;

    const execute_payment_json = {
        "payer_id": payerId,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": "1.00"
            }
        }]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.send('Success');
        }
    });

});

app.get('/cancel', (req, res) => {
    res.send('Cancelled');
});

module.exports = app;
