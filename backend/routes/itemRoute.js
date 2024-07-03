const express = require("express");
const router = express.Router();
const {
  createItem,
  deleteItem,
  getItems,
  getItem,
  updateItem,
} = require("../controllers/itemController");

const multer = require("multer");
const path = require("path");

// Define storage options for Multer
const storage = multer.diskStorage({
  destination: "../frontend/public/itemImages",
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, Date.now() + extension); // Use current timestamp as filename
  },
});

// Filter only image files
const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Initialize multer with storage and file filter options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Create a new item
router.post("/", upload.single("image"), createItem);

// Delete an item
router.delete("/:id", deleteItem);

// Get all items
router.get("/", getItems);

// Get single item
router.get("/:id", getItem);

// Update item with image upload
router.patch("/:id", upload.single("image"), updateItem);

module.exports = router;
