const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Upload = require("../models/Upload");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/uploads
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, caption, uploadType } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const fileType = req.file.mimetype.startsWith("video") ? "video" : "image";

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: fileType,
            folder: "line-dance-app/uploads",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    const newUpload = await Upload.create({
      title,
      caption,
      uploadType,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      fileType,
      userId: "demo-user",
    });

    res.status(201).json({
      message: "Upload successful",
      upload: newUpload,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed" });
  }
});

// GET /api/uploads
router.get("/", async (req, res) => {
  try {
    const uploads = await Upload.find().sort({ createdAt: -1 });

    res.status(200).json(uploads);
  } catch (error) {
    console.error("Get uploads error:", error);
    res.status(500).json({ message: "Failed to get uploads" });
  }
});

module.exports = router;