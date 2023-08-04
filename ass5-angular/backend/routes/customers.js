const express = require('express');
const router = express.Router();
const CustomersController = require('../controllers/customersController');
const customersController = new CustomersController();

router.get('/', customersController.getCustomers);

module.exports = router;