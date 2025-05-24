
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join((process.cwd(), ".env")) });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  node_env : process.env.NODE_ENV,
  secret: process.env.JWT_SECRET,
  expirein : process.env.JWT_EXPIREIN


};