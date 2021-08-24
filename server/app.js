const fs = require("fs");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const placesRoutes = require("./routes/places-routes");
const userRoutes = require("./routes/users-routes");
const HttpError = require("./models/Http-Error");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

// this is to fix the cors error just 1.allow origin 2.set headers 3. set methods 4.just memorize
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,X-Request-With,Content-Type,Accept,Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");

  next();
});

app.use("/api/places", placesRoutes);

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message } || { message: "something unexpected occured" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.w2wvn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("server started and connected to database");
    });
  })
  .catch((error) => {
    console.log(error);
  });
