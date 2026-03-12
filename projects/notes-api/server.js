require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./models/db');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

app.listen(process.env.PORT, () => console.log(`Server on port ${process.env.PORT}`));
