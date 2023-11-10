var bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");

const db = require("./app/models");
const dbConfig = require("./db.config");

const Role = db.role;
const User = db.user;
const Column = db.column;

const app = express();

var corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));


db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/project.routes')(app);
require('./app/routes/skill.routes')(app);
require('./app/routes/userSkills.routes')(app);
require('./app/routes/board.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        _id: "654e1953fc56b6b374b65585",
        name: "Admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Admin' to roles collection");
      });

      new Role({
        name: "Project Manager"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Project Manager' to roles collection");
      });

      new Role({
        name: "Manager"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Manager' to roles collection");
      });

      new Role({
        name: "Developper"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Developper' to roles collection");
      });
    }
  });

  User.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {

      new User({
        name: "Admin",
        email: "admin@smart.com",
        password: bcrypt.hashSync("Password123!", 8),
        role: "654e1953fc56b6b374b65585"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Admin' to roles collection");
      });
      
    }
  });

  Column.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {

      new Column({
        _id: "654e288f894b42d7473d250f",
        name: "Todo"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Todo' to columns collection");
      });
      
    }
  });

  Column.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {

      new Column({
        _id: "654e2897894b42d7473d2513",
        name: "Progress"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Progress' to columns collection");
      });
      
    }
  });

  Column.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {

      new Column({
        _id: "654e65340cb0a3b8026027b3",
        name: "Done"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Done' to columns collection");
      });
      
    }
  });
}