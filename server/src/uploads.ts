import multer from "multer";
import { MAX_FILE_BYTES } from "./constants.js";

// Files are held in memory just long enough to check them and pass them to private storage.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1, fields: 10, fieldSize: 1024 },
});
