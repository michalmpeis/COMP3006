const request = require("supertest")
request("localhost:9000/contact")
    .get('/slack')
    .end(function(err, res) {
        if (err) throw err;
        console.log(res.body.email);
    });