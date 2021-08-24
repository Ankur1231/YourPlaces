const HttpError = require("../models/Http-Error");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");

/////////////////////////////////////////////////////////////////////////////////////////////
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    return next(new HttpError("Fetching user data failed ", 404));
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

/////////////////////////////////////////////////////////////////////////////////////////////

const userSignup = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError("validation result failed", 422));
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Signing up failed plz try again later ", 500));
  }

  if (existingUser) {
    return next(new HttpError("user with the email already exists ", 422));
  }

  // creating encrypted password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError("could not create user plz try again later", 500));
  }

  // creating a user model to send to DB
  const CreatedUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await CreatedUser.save();
  } catch (error) {
    return next(new HttpError("Signing up failed plz try again later", 500));
  }

  //creating jsonwebtoken
  let token;
  try {
    //jwt takes 3 parameters 1: sitrings,object we are passing object to be stored
    //in the token i,e (userId and email) 2: the private key that is used to decrypt
    //the contents of the token 3: expiration time (in hrs)
    token = jwt.sign({ userId: CreatedUser.id, email: CreatedUser.email }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (error) {
    return next(new HttpError("Signing up failed plz try again later", 500));
  }

  //data send back to the frontEnd {creatorId(really imp needed by the whole app,token)}
  res.status(201).json({ userId: CreatedUser.id, email: CreatedUser.email, token: token });
};

/////////////////////////////////////////////////////////////////////////////////////////////

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;

  //checking if there is an user with the provided email
  let existingUser;
  try {
    //findOne returns only 1 query
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError("Logging up failed plz try again later", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentials ", 401));
  }

  //checks if password provided matched one in DB by comparing it using bcrypt
  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError("Logging up failed plz try again later", 500));
  }

  if (!isValidPassword) {
    return next(new HttpError("invalid credentials", 401));
  }

  let token;
  try {
    //jwt takes 3 parameters 1: sitrings,object we are passing object to be stored
    //in the token i,e (userId and email) 2: the private key that is used to decrypt
    //the contents of the token 3: expiration time (in hrs)
    token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });
  } catch (error) {
    return next(new HttpError("logging in failed plz try again later", 500));
  }

  res.json({ userId: existingUser.id, email: existingUser.email, token: token });
};

exports.getUsers = getUsers;
exports.userSignup = userSignup;
exports.userLogin = userLogin;
