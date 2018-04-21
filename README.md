# payment_api
Welcome to payment API

https://api-payment.herokuapp.com/

- Get all payment detail (GET)

https://api-payment.herokuapp.com/api/payment

- Get all user detail (GET)

https://api-payment.herokuapp.com/api/payment

- Get payment detail by user id (GET)

https://api-payment.herokuapp.com/api/payment/[user id]

- Get user detail by id (GET)
https://api-payment.herokuapp.com/api/user/[user id]

- Insert User (POST)

https://api-payment.herokuapp.com/api/user/new

json form request : {"userId":"[id]","userName":"[name]"}

- Increase user balance (GET)

https://api-payment.herokuapp.com/api/balance/[user id]/increase/[amount]

- Insert payment (POST)

https://api-payment.herokuapp.com/api/payment/new

json form request : {"userId":"[id]","productId":"[product id]","webName":[web name],"price": [price],"amount": [amount]}
