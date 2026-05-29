const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

// Upload media to Cloudinary
router.post("/", upload.single("media"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "auto",
      folder: "linedance_uploads",
    });

    fs.unlinkSync(req.file.path);

    res.status(201).json({
      mediaUrl: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });
  }  catch (error) {
  console.error("FULL UPLOAD ERROR:", error);

  res.status(500).json({
    message: "Upload failed",
    error: error.message,
  });
}
});

module.exports = router;