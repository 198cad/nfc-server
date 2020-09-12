const { Schema, model } = require("mongoose");

const SchemaAbsen = new Schema({
  uid: { type: String, required: true },
  eid: { type: String, required: true },
  apikey: { type: String, required: true },
  apisecret: { type: String, required: true },
});

module.exports = model("absen", SchemaAbsen);
