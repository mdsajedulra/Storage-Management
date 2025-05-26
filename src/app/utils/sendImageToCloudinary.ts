import { UploadApiResponse, v2 as cloudinary } from "cloudinary";

import fs from "fs";
import multer from "multer";
import config from "../config";
console.log(config.cloudinary);
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const sendImageToCloudinary = (
  imageName: string,
  path: string
): Promise<Record<string, unknown>> => {
  console.log(imageName, path);
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,

      { public_id: imageName.trim(), resource_type: "auto" },
      function (error, result) {
        // console.log(result);
        if (error) {
          reject(error);
        }

        resolve(result as UploadApiResponse);
        // delete a file asynchronously
        fs.unlink(path, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("File is deleted.");
          }
        });
      }
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + "/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

// delete image from cloudinary
// This function deletes an image from Cloudinary using its public ID

export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

export const renameImageInCloudinary = async (
  oldPublicId: string,
  newPublicId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.rename(oldPublicId, newPublicId, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};
