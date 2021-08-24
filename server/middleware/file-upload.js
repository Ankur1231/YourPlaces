const multer = require("multer");
const uuid = require("uuid");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const fileUpload = multer({
  //file size limit
  limits: 500000,
  storage: multer.diskStorage({
    //where it should store
    destination: (req, file, cb) => {
      cb(null, "uploads/images");
    },
    //how the file should be named
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuid.v1() + "." + ext);
    },
  }),
  //which files to accept
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("invalid file type");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
