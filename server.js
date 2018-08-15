const express = require("express");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const { PORT, DATABASE_URL } = require("./config");
const { userContent } = require("./models");
const app = express();
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("common"));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/responses", (req, res) => {
  userContent
    .find()
    .limit(10)
    .then(responses => {
      res.json({
        responses: responses.map(response => response.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

//by ID
app.get("/responses/:id", (req, res) => {
  userContent
    .findById(req.params.id)
    .then(response => res.json(response.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.post("/responses", (req, res) => {
  const requiredFields = ["title", "response"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  userContent
    .create({
      title: req.body.title,
      response: req.body.response,
      receivedMessage: req.body.receivedMessage
    })
    .then(response => res.status(201).json(response.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

app.put("/responses/:id", (req, res) => {
  // does id in the request and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ["title", "response", "receivedMessage"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  userContent
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(response => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

app.delete("/responses/:id", (req, res) => {
  userContent
    .findByIdAndRemove(req.params.id)
    .then(response => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// requests to non-existent endpoint
app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

//Server Control
let server;

function runServer() {
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve(server);
      })
      .on("error", err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log("Closing server");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
