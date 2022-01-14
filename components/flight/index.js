const express = require('express');
const router = express.Router();

const flightController = require('./flightController');

// get flight list
router.get('/', flightController.list);

//get add flight page
router.get('/addflight', flightController.addFlightPage);
router.post('/addflight', flightController.addFlightForm);
router.post('/addextendflight', flightController.addExtendFlight);
router.post('/addseatclass', flightController.addSeatClass);

router.get('/updateflight/:flightId', flightController.updateFlightPage);
router.post('/updateflight/:flightId', flightController.updateFlightForm);
// get flight detail
router.get('/:flightId', flightController.detail);
module.exports = router;