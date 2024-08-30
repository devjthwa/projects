const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

// Middleware to validate request body
const validateInventory = (req, res, next) => {
    const { name, desc, unit, hsn, category } = req.body;
    if (!name || !desc || !unit || !hsn || !category ) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    next();
  };
  
// get inventories 
router.get('/', async (req, res) => {
  try {
      const inventories = await Inventory.find(); 
      res.json(inventories); 
  } catch (err) {
      res.status(500).json({ message: err.message }); 
  }
});

// GET a inventory by ID
router.get('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new inventory
router.post('/', async(req, res) => {
    const inventory = new Inventory({
        name: req.body.name,
        desc: req.body.desc,
        unit: req.body.unit,
        hsn: req.body.hsn,
        category: req.body.category,
    });

    try {
        const newInventory = await inventory.save();
        res.status(201).json(newInventory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: Remove a inventory
router.delete('/:id', async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) return res.status(404).json({ message: 'item not found' });

        await inventory.deleteOne();
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// patch inventroy update
router.patch('/:id',  validateInventory, async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id);
        if (!inventory) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (req.body.name != null) {
            inventory.name = req.body.name;
        }
        if (req.body.desc != null) {
            inventory.desc = req.body.desc;
        }
        if (req.body.unit != null) {
            inventory.unit = req.body.unit;
        }
        if (req.body.hsn != null) {
            inventory.hsn = req.body.hsn;
        }

        if (req.body.category != null) {
            inventory.category = req.body.category;
        }

        const updatedInventory = await inventory.save();
        res.json(updatedInventory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

