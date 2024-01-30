const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const env = require("dotenv");
const userRoute = require('./Routes/userRoute');
const chatRoute = require('./Routes/chatRoute');
const messageRoute = require('./Routes/messageRoute');

const app = express();
env.config();

app.use(express.json());
app.use(cors());
app.use('/api/users', userRoute);
app.use('/api/chats', chatRoute);
app.use('/api/messages', messageRoute);

const port =  process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

app.listen(port, (req, res)=>{
    console.log(`Server is running on port: ${port}`);
})

mongoose.connect(uri).then(()=>{
    console.log("MongoDB connection established");
}).catch((err)=>{
    console.log("MongoDB connection failed: ", err.message);
});