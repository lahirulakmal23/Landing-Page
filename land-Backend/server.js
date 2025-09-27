import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


import attendeeRoutes from './Modules/Register/Routes/reg.Route.js'; // 👈 ADD

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const host = '127.0.0.1';


app.use(cors());
app.use(express.json());

// Mongo
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Routes

app.use("/api/attendees", attendeeRoutes); // 👈 ADD (REST: POST /api/attendees)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
