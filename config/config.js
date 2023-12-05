import dotenv from "dotenv";

dotenv.config();
export const PORT = process.env.PORT;
export const dbURL = process.env.DATABASE_URL;
// export const serviceAccount = process.env.SERVICE_ACCOUNT;
