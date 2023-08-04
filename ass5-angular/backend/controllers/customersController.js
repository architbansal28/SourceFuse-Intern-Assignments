const Customer = require('../models').customers;

class CustomersController {
    async getCustomers(req, res) {
        try {
            const customers = await Customer.findAll({
                // attributes: []
            });
            res.json(customers);
        } catch (error) {
            console.error('Error reading users:', error);
            res.status(500).json({ error: 'Failed to read users.' });
        }
    }
}

module.exports = CustomersController;