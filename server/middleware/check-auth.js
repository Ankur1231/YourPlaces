const jwt = require("jsonwebtoken");
const checkJWT = (req, res, next) => {
  const HttpError = require("../models/Http-Error");

  //front end will send the method OPTIONS instead of POST so to return next
  // to carry on the request
  if (req.method === "OPTIONS") {
    return next();
  }

  //checking for the token in the headers
  //content of authorization :'Bearer TOKEN' therefore using
  //split to seperate the bearer and token and accessing the [1] index
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed token not found");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(new HttpError("Authentication failed next", 401));
  }
};

module.exports = checkJWT;
