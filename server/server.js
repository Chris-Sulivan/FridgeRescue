// Import the Express application
const app = require("./app");
import './server/config/env.js';          
import mongoose from 'mongoose';
import app from './server/express.js';
import categoryRouter from './server/routes/categoryRoutes.js';
import unitRouter from './server/routes/unitRoutes.js';
import unitRouter from './server/routes/unitRoutes.js';
import foodItemRouter from './server/routes/fooditemRoutes.js';
import authRouter from './server/routes/authRoutes.js';

app.use('/api/categories', categoryRouter);
app.use('/api/units', unitRouter);
app.use('/api/fooditems', foodItemRouter);
app.use('/api/auth', authRouter);
// Define the server port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`FridgeRescue server running on port ${PORT}`);
});