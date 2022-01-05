const express = require('express');
const router = express.Router();

const profileController = require('./profileController');

/* GET edit account page. */
router.get('/editaccount', profileController.editAccountPage);

module.exports = router;