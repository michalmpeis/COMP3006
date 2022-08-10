const request = require("supertest")
request("localhost:9000/index")
    .get('/slack')
    .end(function(err, res) {
        if (err) throw err;
        console.log(res.body.email);
    });