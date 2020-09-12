const mongoose = require("mongoose");
const mongoURI = "mongodb://168.168.168.110:27017/absensi";
// const mongoURI = "mongodb://localhost:27017/absensi";

module.exports = () => {
  const mongoTryConnect = function () {
    return mongoose.connect(
      mongoURI,
      { useUnifiedTopology: true, useNewUrlParser: true },
      function (error) {
        if (error) {
          console.log(
            "Terjadi masalah ketika mencoba terhubung dengan mongodb, mencoba kembali ...."
          );
          setTimeout(mongoTryConnect, 4000);
        }
      }
    );
  };
  mongoTryConnect();
  mongoose.connection.on("disconnected", () => {
    console.log("disconnected");
    mongoTryConnect();
  });
  mongoose.connection.on("connecting", () => {
    console.log("connecting....");
  });
  mongoose.connection.on("connected", () => {
    console.log("connected");
  });
  mongoose.connection.on("disconnecting", () => {
    console.log("disconnecting");
  });
  mongoose.connection.on("close", () => {
    console.log("close");
  });
  mongoose.connection.on("reconnected", () => {
    console.log("reconnected");
  });
  mongoose.connection.on("error", () => {
    console.log("error");
  });

  process.on("SIGINT", process.exit.bind(process));
};
