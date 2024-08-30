const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Middleware to validate request body
const validateCustomer = (req, res, next) => {
    const { name, email, phone, address } = req.body;
    if (!name || !email || !phone || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    next();
  };
  
// get customers 
router.get('/', async (req, res) => {
  try {
      const customers = await Customer.find(); 
      res.json(customers); 
  } catch (err) {
      res.status(500).json({ message: err.message }); 
  }
});

// GET a customer by ID
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new customer
router.post('/', async(req, res) => {
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
    });

    try {
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove a customer 
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        await customer.deleteOne();
        res.json({ message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// patch customer update
router.patch('/:id',  validateCustomer, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (req.body.name != null) {
            customer.name = req.body.name;
        }
        if (req.body.email != null) {
            customer.email = req.body.email;
        }
        if (req.body.phone != null) {
            customer.phone = req.body.phone;
        }
        if (req.body.address != null) {
            customer.address = req.body.address;
        }

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

