const express = require('express');
const router = express.Router();

const planeController = require('./planeController');

// get plane list
router.get('/', planeController.list);

// get planes search
router.get('/search', planeController.search);

//get add plane page
router.get('/addplane', planeController.addPlanePage);
router.post('/addplane', planeController.addPlaneForm);

//get update plane page
router.get('/updateplane/:planeId', planeController.updatePlanePage);
router.post('/updateplane', planeController.updatePlaneForm);

module.exports = router;