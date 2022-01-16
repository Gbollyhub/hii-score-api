const express = require('express');
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const mongoose = require('mongoose')
const app = express();

mongoose.connect('mongodb+srv://aliasgbolly:Gbolly16@hiiscore.hcwha.mongodb.net/hiiscore?retryWrites=true&w=majority').then(()=> console.log('connected to mongodb'))
.catch(e=>console.error('could not connect'))

// app.use(cors);

app.use(express.json())
app.use(morgan('tiny'))


const authRoute = require('./routes/auth')
app.use('/', authRoute)

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log("App running on port ", port)
})