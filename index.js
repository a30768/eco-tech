const express = require("express");
const path = require("path");
require('dotenv').config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/swagger/swagger.json');


const app = express();
let port=process.env.PORT || 3000;
let uri=process.env.MONGO_URI;

//database connection
mongoose.connect(uri).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.log(err);
})

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api-docjs', express.static('./public/api-docjs'));
app.use("/api", require("./controllers/routes/userRoute"));

app.listen(port, () => {
    console.log("Servidor running por:"+port);
})