const express = require("express");
const server = express();
const PORT = process.env.PORT || 5000;

server.use(express.json());

server.get("/", (req, res) => {
  res.send("Blog App!!");
});

server.listen(PORT, () => {
  console.log(`Server runnning at port ${PORT}`);
});