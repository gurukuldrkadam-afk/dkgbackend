require("dotenv").config();
const express = require('express');
const cookieParser = require('cookie-parser');
const app = require('./src/app');
const connectDB = require('./src/db/db');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});