const { Schema, model } = require("mongoose");

const SchemaAbsen = new Schema({
  uid: { type: String, required: true },
  eid: { type: String, required: true },
  apikey: { type: String, required: true },
  apisecret: { type: String, required: true },
});

module.exports = model("absen", SchemaAbsen);

const kueri = `
    SELECT 
        inventory.barang.ID AS id_obat_alkes , 
        inventory.barang.NAMA AS item_name,
        (SELECT inventory.satuan.NAMA FROM inventory.satuan WHERE inventory.satuan.ID = inventory.barang.SATUAN ) AS stock_uom,
        inventory.barang.HARGA_BELI AS valuation_rate, 
        inventory.barang.HARGA_JUAL AS standard_rate
        FROM inventory.barang WHERE inventory.barang.POSTING = 0 LIMIT 1
    `;
return new Promise((resolve, reject) => {
  fromSimrs.getConnection((err, con) => {
    if (err) {
      con.release();
      console.log(
        "Server SIMRS hilang / putus dari jaringan / poweroff mode !"
      );
    } else {
      con.query(kueri, (error, rows, fields) => {
        if (error) reject(error);
        con.release();
        resolve(rows);
      });
    }
  });
});
