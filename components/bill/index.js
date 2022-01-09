const express = require('express');
const router = express.Router();

const billController = require('./billController');

// get bills search
router.get('/search', billController.search);

/* GET orders page. */
router.get('/', billController.list);

router.get('/:billId', billController.detail);

module.exports = router;