const fs = require("fs");

const port = 8080;

const express = require("express");
const app = express();
app.use(express.static("public"));
const server = app.listen(port);

console.log(`Webserver is running on port ${port}.`);

const socket = require("socket.io");
const io = socket(server);
io.sockets.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected.`);

  let disconnect = () => {
    console.log(`Client ${socket.id} disconnected.`);
  };

  let getScatterPlotData = (parameters) => {
    console.log(`Received data request with these parameters: ${parameters}`);
    fs.readFile(`./data/${parameters}.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let json_data = JSON.parse(data);
      console.log(json_data);
      socket.emit("receiveScatterPlotData", json_data);
    });
  };

  let getBarChartData = (parameters) => {
    console.log(`Received data request with these parameters: ${parameters}`);
    fs.readFile(`./data/${parameters}.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let json_data = JSON.parse(data);
      console.log(json_data);
      socket.emit("receiveBarchartData", json_data);
    });
  };

  socket.on("disconnect", disconnect);
  socket.on("getScatterPlotData", getScatterPlotData);
  socket.on("getBarChartData", getBarChartData);
});
