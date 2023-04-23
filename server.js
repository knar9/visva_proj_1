const fs = require("fs")

const port = 8080

const express = require("express")
const app = express()
app.use(express.static("public"))
const server = app.listen(port)

console.log(`Webserver is running on port ${port}.`)

const socket = require("socket.io")
const io = socket(server)
io.sockets.on("connection", (socket) => {
    console.log(`Client ${socket.id} connected.`)
    
    let disconnect = () => {
        console.log(`Client ${socket.id} disconnected.`)
    }
    

    
    let get_data = (parameters) => {
        console.log(`Received data request with these parameters: ${parameters}`)
        fs.readFile(`./data/${parameters}.json`, "utf8", (err, data) => {
        if (err) {
        console.error(err)
        return
        }
        let json_data = JSON.parse(data)
        socket.emit("example_data", json_data)
        })
        }
        

    socket.on("disconnect", disconnect)

    socket.on("get_data", get_data)
})