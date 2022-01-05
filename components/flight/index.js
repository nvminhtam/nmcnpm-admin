const express = require('express');
const router = express.Router();

const flightController = require('./flightController');

// get flight list
router.get('/', flightController.list);

// // get flights search
// router.get('/search', flightController.search);

// //get add flight page
// router.get('/addadmin', flightController.addAdminPage);
// router.post('/addadmin', flightController.addAdminForm);

// //get update flight page
// router.get('/updateadmin/:adminId', flightController.updateAdminPage);
// router.post('/updateadmin', flightController.updateAdminForm);


// // get flight detail
// router.get('/:adminId', flightController.detail);
module.exports = router;