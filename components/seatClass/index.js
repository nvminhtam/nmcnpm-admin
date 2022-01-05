const express = require('express');
const router = express.Router();

const seatClassController = require('./seatClassController');

// get seatclass list
router.get('/', seatClassController.list);

// get seatclasses search
router.get('/search', seatClassController.search);

//get add seatclass page
router.get('/addseatclass', seatClassController.addSeatClassPage);
router.post('/addseatclass', seatClassController.addSeatClassForm);

//get update seatclass page
router.get('/updateseatclass/:seatClassId', seatClassController.updateSeatClassPage);
router.post('/updateseatclass', seatClassController.updateSeatClassForm);

module.exports = router;