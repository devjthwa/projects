const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const customerRoutes = require('./routes/customers');
const inventoryRoutes = require('./routes/inventories');

// MongoDB connection URI
const MONGODB_URI = 'mongodb://localhost:27017/CoreSphere'; 
const PORT = 5000; 

const app = express();

//middlewares
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

// routes here
app.use('/api/customers', customerRoutes);
app.use('/api/inventories', inventoryRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
