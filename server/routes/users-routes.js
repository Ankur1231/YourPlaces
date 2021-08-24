const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const userController = require("../controllers/users-controller");
const fileUpload = require("../middleware/file-upload");

router.get("/", userController.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(), //normaliseEmail = Test@teSt.com => test@test.com
    check("password").isLength({ min: 6 }),
  ],
  userController.userSignup
);

router.post("/login", userController.userLogin);

module.exports = router;
