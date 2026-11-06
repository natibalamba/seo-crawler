import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar .env desde el directorio padre
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const config = {
  START_URL: process.env.START_URL,
  BASIC_USER: process.env.BASIC_USER,
  BASIC_PASS: process.env.BASIC_PASS
};
