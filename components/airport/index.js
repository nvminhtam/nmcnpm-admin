const express = require('express');
const router = express.Router();

const airportController = require('./airportController');

// get airport list
router.get('/', airportController.list);

// get airports search
router.get('/search', airportController.search);

//get add airport page
router.get('/addairport', airportController.addAirportPage);
router.post('/addairport', airportController.addAirportForm);

//get update airport page
router.get('/updateairport/:airportId', airportController.updateAirportPage);
router.post('/updateairport', airportController.updateAirportForm);

module.exports = router;