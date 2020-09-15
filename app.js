const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const { NFC } = require("nfc-pcsc");
const bodyParser = require("body-parser");
const cors = require("cors");
const sql = require("./mysql");
// require("./mongoose")();
// const Absen = require("./model");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/nfc/:id/:logtype", (req, res) => {
  const { id, logtype } = req.params;
  res.send({ id, logtype }).status(200);
});

app.get("/get-data/:nama", (req, res) => {
  res.send(req.params);
});

app.post("/insert", async (req, res) => {
  const { uid, eid, apikey, apisecret } = req.body;
  const kueri = `INSERT INTO absensi.absen
  (uid, eid, apikey, apisecret)
  VALUES( '${uid}', '${eid}', '${apikey}', '${apisecret}');`;

  sql.getConnection((err, con) => {
    if (err) {
      con.release();
      console.log(
        "Server SIMRS hilang / putus dari jaringan / poweroff mode !"
      );
    } else {
      con.query(kueri, (error, rows, fields) => {
        if (error) {
          con.release();
        } else {
          res.send("OK");
        }
      });
    }
  });
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

process.setMaxListeners(0);
server.listen(5000, () => console.log(`Listening on port 5000`));
