import express from "express";
import multer from "multer";
import {
  uploadImage,
  getAllImages,
  getPublishedImages,
  toggleStatus,
  deleteImage,
  reorderGallery,
} from "../controllers/galleryController.js";
import sharp from "sharp";

const router = express.Router();

// STORAGE
const storage = multer.diskStorage({
  destination: function (
    req,
    file,
    cb
  ) {
    cb(null, "temp/");
  },

  filename: function (
    req,
    file,
    cb
  ) {
    cb(
      null,
      Date.now() +
        "-" +
        file.originalname
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize:
      50 * 1024 * 1024
  },
});

// const upload = multer({ storage });

// ROUTES
router.post(
  "/",
  upload.array("images", 50),
  uploadImage
);
router.get("/", getAllImages);
router.get("/published", getPublishedImages);
router.put("/:id/toggle", toggleStatus);
router.delete("/:id", deleteImage);
router.put("/reorder", reorderGallery);

export default router;