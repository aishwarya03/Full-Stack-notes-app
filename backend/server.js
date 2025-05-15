// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
const notesRoutes = require('./routes/notes');

app.use('/api/users', userRoutes);   // Signup/Login
app.use('/api/notes', notesRoutes); // Notes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
