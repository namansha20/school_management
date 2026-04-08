require('dotenv').config();
const express = require('express');
const schoolRoutes = require('./src/routes/schoolRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'School Management API is running' });
});

app.use('/', schoolRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
