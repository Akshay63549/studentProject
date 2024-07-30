const express = require('express')
const cors = require("cors");
const app = express()

const dotenv = require('dotenv');
dotenv.config();
//cors otions
var corsOptions = {
  origin: "*"
};
app.use(cors(corsOptions));

const errorMiddleware = require('./middleware/error-middleware');

//connect database
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGOURL).then(() => {
  console.log("Successfully connect to MongoDB.");
})

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
// parse requests of content-type - application/json
app.use(express.json({ limit: '100mb' }));

//admin routes
app.use('/api/product', require('./routes/product.routes'))

app.get('/', async(req, res) => {
  res.send('Student Project Run Successfully!')
})
app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`server is running on ${PORT}`);
})
