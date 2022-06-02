require("dotenv").config({ path: __dirname + "/.env" });
var app = require("express")();
var server = require("http").createServer(app);
const websocket = require("./modules/socket");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes");

app.use(cors());
app.use(bodyParser.json());

app.use("/", router);

websocket(server, app);
server.listen(3001, function () {
  // process.send("ready");
  console.log("socket io server listening on port 3001");
});
// process.on("SIGINT", function () {
//   isDisableKeepAlive = true;
//   server.close(function () {
//     console.log("server closed");
//     process.exit(0);
//   });
// });
