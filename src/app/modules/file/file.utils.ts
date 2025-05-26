import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const getCategoryFromExtension = (
  extension: string
) => {
  // console.log(extension, "extension from utils");
  const lowerExt = extension.toLowerCase();

  console.log(lowerExt, "lowerExt from utils");
  if (["png", "jpg", "jpeg", "gif", "bmp", "webp"].includes(lowerExt)) {
    return "image";
  }

  if (["pdf"].includes(lowerExt)) {
    return "pdf";
  }

  if (["docx", "doc", "txt", "csv", "md", "rtf"].includes(lowerExt)) {
    return "note";
  }

  //  default fallback
  return "note";
};

export const upload = multer({ storage });
