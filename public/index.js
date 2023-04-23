function print_hello_world() {
  console.log("Hello world!")
}
// this is working because of the import in the html file
// https://socket.io/docs/v4/client -installation/#standalone -build
const socket = io()

socket.on("connect", () => {
  console.log("Connected to the webserver.")
})
socket.on("disconnect", () => {
  console.log("Disconnected from the webserver.")
})
socket.on("example_data", (obj) => {
  console.log(obj)
})

function request_example_data(string) {
  socket.emit("get_data", string)
}