import { v2 as cloudinary } from "cloudinary";
import { config } from "../config/default.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Options } from "multer-storage-cloudinary";
import { Request, Response } from "express";

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export const getCloudinaryPublicId = (url: string) => {
  const uploadSegment = "/upload/";
  const index = url.indexOf(uploadSegment);
  if (index === -1) return null;

  let publicIdWithVersionAndExt = url.substring(index + uploadSegment.length);
  publicIdWithVersionAndExt = publicIdWithVersionAndExt.replace(/^v\d+\//, "");
  publicIdWithVersionAndExt = publicIdWithVersionAndExt.split("?")[0];

  const lastDotIndex = publicIdWithVersionAndExt.lastIndexOf(".");
  if (lastDotIndex !== -1) {
    publicIdWithVersionAndExt = publicIdWithVersionAndExt.substring(0, lastDotIndex);
  }

  const parts = publicIdWithVersionAndExt.split("/");
  return parts[parts.length - 1];
};

export const isImageUrl = (url: string): boolean => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"];

  if(!url) return false;

  const cleanUrl = url.split("?")[0].split("#")[0];
  
  const lastDotIndex = cleanUrl.lastIndexOf(".");
  if (lastDotIndex === -1) return false;

  const extension = cleanUrl.substring(lastDotIndex).toLowerCase();
  return imageExtensions.includes(extension);
};


export const storage = new CloudinaryStorage({
  cloudinary,
  params: (req: Request, file: Express.Multer.File) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: isVideo ? "videos" : "notes",
      resource_type: isVideo ? "video" : "raw",
      type: "upload",
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      format: file.originalname.split('.').pop(),
      access_mode: "public",
    }
  },
});

export default cloudinary;