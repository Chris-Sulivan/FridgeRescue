import './config/env.js';          
import mongoose from "mongoose";
import app from './express.js';
import categoryRouter from './routes/categoryRoutes.js';
import unitRouter from './routes/unitsRoutes.js';
import foodItemRouter from './routes/fooditemRoutes.js';
import authRouter from './routes/authRoutes.js';

app.use('/api/categories', categoryRouter);
app.use('/api/units', unitRouter);
app.use('/api/fooditems', foodItemRouter);
app.use('/api/auth', authRouter);

// Define the server port
const PORT = process.env.PORT || 5000;

// Retrieve strictly from environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Database Connected Successfully!");
    
    // Start the server only after the database connection is established
    app.listen(PORT, () => {
      console.log(`FridgeRescue server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed Error:", error.message);
  });

export default app;