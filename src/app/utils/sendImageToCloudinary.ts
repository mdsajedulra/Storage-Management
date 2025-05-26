import { UploadApiResponse, v2 as cloudinary } from "cloudinary";
import { error } from "console";
import fs from "fs";
import multer from "multer";

cloudinary.config({
  cloud_name: "dwuho3oin",
  api_key: "524431726747944",
  api_secret: "s3ZBeFFDqAM-0PZlp78eDoj4wlI", // Click 'View API Keys' above to copy your API secret
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
