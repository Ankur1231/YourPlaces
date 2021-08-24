const fs = require("fs");

const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const HttpError = require("../models/Http-Error");
const getCoordsForAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");
const mongooseUniqueValidator = require("mongoose-unique-validator");

/////////////////////////////////////////////////////////////////////////////////////////////
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("could not get places", 404));
  }

  if (!place) {
    return next(new HttpError("could not find a place for the provided place id", 404));
  }

  res.json({ place: place.toObject({ getters: true }) });
};

/////////////////////////////////////////////////////////////////////////////////////////////

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (error) {
    return next(new HttpError("could not find the user", 500));
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError("could not find a place for the provided user id", 404));
  }

  // Find method returns an array therefore we map it
  res.json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
};

/////////////////////////////////////////////////////////////////////////////////////////////

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("validation error", 422));
  }

  const { title, description, image, address } = req.body;
  const coordinates = getCoordsForAddress();
  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    //extract the file path which multer gives automatically and store that path in database
    image: req.file.path,
    creator: req.userData.userId,
  });

  //checking if user already exist or not

  let user;
  try {
    user = await User.findById(req.userData.userId);
  } catch (err) {
    const error = new HttpError("could not find user by that id", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("user does not exist", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession(); //create a session
    sess.startTransaction(); //start the transaction
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace); // this will only the _id
    await user.save({ session: sess });
    await sess.commitTransaction(); //commit the transaction i,e all the changes will be stored here
  } catch (err) {
    const error = new HttpError("creating place failed", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

/////////////////////////////////////////////////////////////////////////////////////////////

const updatePlace = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("eorror validation failed plz try again", 422));
  }

  // Getting title and description from the body
  const { title, description } = req.body;

  // Getting the place id
  const placeId = req.params.pid;

  let place;
  // Finding the place by its id
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("could not update place", 500));
  }

  //checking if the userId in the token if same of the one whose data we wanna manipulate
  // place.creator is an object id therefore we convert to string
  if (place.creator.toString() !== req.userData.userId) {
    return next(new HttpError("you are not allowed to edit this palce", 401));
  }

  // Updating the title and description
  place.title = title;
  place.description = description;

  // Saving the changes
  try {
    await place.save();
  } catch (error) {
    return next(new HttpError("could not update place", 500));
  }

  // Converting the JSON to javascript object and since the _id is an object convert it into a string using the getters
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

/////////////////////////////////////////////////////////////////////////////////////////////

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    //populate refer to doc stored in another collection and work with data in that other collection
    place = await Place.findById(placeId).populate("creator");
  } catch (error) {
    return next(new HttpError("error establishing connection", 500));
  }

  if (!place) {
    return next(new HttpError("could not find place for this id", 404));
  }

  if (place.creator.id !== req.userData.userId) {
    return next(new HttpError("you are not allowed to edit this palce", 403));
  }

  const imagePath = place.image;

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    return next(new HttpError("could not delete place", 500));
  }

  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "place deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
