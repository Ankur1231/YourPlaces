const express = require("express");
const { check } = require("express-validator");

const fileUpload = require("../middleware/file-upload");
const checkJWT = require("../middleware/check-auth");

const router = express.Router();

const placeController = require("../controllers/places-controller");

router.get("/:pid", placeController.getPlaceById);

router.get("/user/:uid", placeController.getPlacesByUserId);

//since the code routes get read from top to bottom this middle ware get read first
// before going to the routes below it i,e the post,patch routes this middleware will
// act as an protection checking the jwt token first and block the request if validation failed so
router.use(checkJWT);

router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placeController.createPlace
);

router.patch(
  "/:pid",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placeController.updatePlace
);

router.delete("/:pid", placeController.deletePlace);

module.exports = router;
