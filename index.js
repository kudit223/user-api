const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRotues = require('./routes/userRoutes')

//express app
const app = express();

//middleware
app.use(express.json());
app.use('/api',userRotues)

//mongoDB configuration
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log('mongoDB connected successfully!!')
})
.catch(error =>{
    console.log("Error:",error.message)
})

// server configuraion
app.listen(process.env.PORT,()=>{
    console.log("Server is running....")
})