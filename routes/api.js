/**
 * Created by mats on 30.04.15.
 */

var express = require('express');
var router = express.Router();

router.get('/questions', function(req, res) {
    res.send("API is up");
});

module.exports = router;