require('dotenv').config();
const express = require('express');
require("./config/database");

const app = express();
const route_manager = require("./modules/v1/routeManager");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("", route_manager);

try {
    app.listen(process.env.PORT)
    console.log('Server running on port : ' + (process.env.PORT || 3000));
} catch (error) {
    console.log('connection failed');
}