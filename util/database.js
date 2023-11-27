const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://oluwaseunus:MSyxDEeptFf3XcDd@cluster0.bukbrqm.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db("shop");
      callback();
    })
    .catch((err) => console.log({ err }));
};

const getDb = () => {
  if (!_db) throw "No database found!";

  return _db;
};

module.exports = {
  getDb,
  mongoConnect,
};
