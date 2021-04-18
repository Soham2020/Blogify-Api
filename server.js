const express = require("express");
const server = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
dotenv.config({ path: './config.env' })

const userRoute = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoute');

const DB = process.env.DATABASE;
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(() => {
  console.log('MONGODB Connected...');
}).catch((err) => {
  console.log('Not Connected...')
})

server.use(express.json());
server.use(cors());

server.get("/", (req, res) => {
    res.send("<h1>Blogify Server is Up & Running!</h1>");
});

server.use('/users', userRoute)
server.use('/blogs', blogRoute)

// PORT Connected
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server runnning at port ${PORT}`);
});