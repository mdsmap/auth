const express = require('express');
const router = express.Router();

const authorize = require('../_helpers/authorize.js')


// Routes
router.get('/', authorize(), dummy);     // dummy service

module.exports = router;                

function dummy(req, res, next) {
    res.json({message:"Success!"})
}
