const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { NFC } = require("nfc-pcsc");
const bodyParser = require("body-parser");
var cors = require("cors");

require("./mongoose")();
const Absen = require("./model");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

app.post("/insert", async (req, res) => {
  const { uid, eid, apikey, apisecret } = req.body;
  const newAbsen = new Absen({
    uid,
    eid,
    apikey,
    apisecret,
  });

  await newAbsen.save();
  res.send("ok");
});

const server = http.createServer(app);
const io = socketIO(server);
const nfc = new NFC();

nfc.on("reader", (reader) => {
  console.log(`${reader.reader.name}`);
  io.on("connection", function (socket) {
    console.log("new client connected");
    reader.on("card", (card) => {
      io.emit("uid", card.uid);
      console.log(card.uid);
    });
  });
  reader.on("error", (err) => {
    console.log("error nfc");
  });
});

// process.setMaxListeners(0);
server.listen(5000, () => console.log(`Listening on port 5000`));
