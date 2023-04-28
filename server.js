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

  let get_data = (parameters) => {
    console.log(`Received data request with these parameters: ${parameters}`);
    fs.readFile(`./data/${parameters}.json`, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      let json_data = JSON.parse(data);
      console.log(json_data);

      var dict = {};

      for (i = 0; i < json_data.length; i++) {
        // json_data[i]["minage"];
        var currentEntry = json_data[i]["minage"];
        if (dict[currentEntry] === undefined) {
          dict[currentEntry] = 1;
        } else {
          dict[currentEntry] = dict[currentEntry] + 1;
        }
      }
      console.log(dict);
      var arr = [];
      for (const [key, value] of Object.entries(dict)) {
        arr.push({ minAge: key, frequency: value });
      }
      console.log(arr);
      socket.emit("receiveData", arr);
    });
  };

  socket.on("disconnect", disconnect);
  socket.on("get_data", get_data);
});
