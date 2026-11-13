import './config/env.js';          
import mongoose from "mongoose"; // <-- Added mongoose import
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

// Database URI fallback
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://fridgerescue_team:q2JI9SBWfaBWrtuq@fridgerescuecluster.e9hneuy.mongodb.net/fridgerescue?retryWrites=true&w=majority&appName=FridgeRescueCluster";

console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('MONGO_URI loaded:', !!process.env.MONGO_URI);

// Connect to MongoDB and start the server
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Portfolio Database Connected Successfully!");
    
    // Start the server only after the database connection is established
    app.listen(PORT, () => {
      console.log(`FridgeRescue server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection Failed Error:", error.message);
  });

export default app;