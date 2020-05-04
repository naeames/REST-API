const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const assert = require("assert");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

const dataBase = "contactlist-api";
const mongo_url = require("./config/keys").mongoURI;

// Connect to mongodb -->  local URL
MongoClient.connect(
  mongo_url,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err, client) => {
    assert.equal(err, null, "Database connexion failed!");
    const db = client.db(dataBase);

    // Displays all contacts :
    app.get("/", (req, res) => {
      db.collection("contactlist")
        .find()
        .toArray()
        .then((data) => res.send(data))
        .catch((err) => console.error("err"));
    });

    // Display one contact :
    app.get("/:id", (req, res) => {
      const contactid = ObjectID(req.params.id);
      db.collection("contactlist")
        .findOne({ _id: contactid })
        .then((data) => res.send(data))
        .catch((err) => console.error(err));
    });

    // Add new contact :
    app.post("/", (req, res) => {
      let newContact = req.body;
      db.collection("contactlist").insertOne(newContact, (err, data) => {
        if (err) console.log("Can't add a new contact !");
        else res.send(data);
      });
    });

    // Delete a contact :
    app.delete("/:id", (req, res) => {
      let contactid = ObjectID(req.params.id);
      db.collection("contactlist").findOneAndDelete(
        { _id: contactid },
        (err, data) => {
          if (err) console.log("Can't delete the contact!");
          else res.send(data);
        }
      );
    });

    // Edit a contact :
    app.put("/:id", (req, res) => {
      let updatedContact = req.body;
      let contactid = ObjectID(req.params.id);
      db.collection("contactlist").findOneAndUpdate(
        { _id: contactid },
        {
          $set: { ...updatedContact },
        },
        (err, data) => {
          if (err) console.log("Can't Update the contact");
          else res.send(data);
        }
      );
    });
  }
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) console.log("server err");
  else console.log(`Server is running on port : ${PORT}`);
});
