import mongoose, { Schema, models } from "mongoose";

const UploadSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    caption: {
      type: String,
      default: "",
    },

    uploadType: {
      type: String,
      enum: ["dance-video", "tutorial", "event-flyer", "thumbnail"],
      default: "dance-video",
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    userId: {
      type: String,
      default: "demo-user",
    },
  },
  { timestamps: true }
);

const Upload = models.Upload || mongoose.model("Upload", UploadSchema);

export default Upload;