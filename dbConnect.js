import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

// Render dB
export const sql = postgres({
  host: process.env.PROD_HOST,
  port: process.env.PROD_PORT,
  database: process.env.PROD_DATABASE,
  username: process.env.PROD_USERNAME,
  password: process.env.PROD_PASSWORD,
  ssl: "require",
});

//Local DB
// export const sql = postgres({
//   host: process.env.DEV_HOST,
//   port: process.env.DEV_PORT,
//   database: process.env.DEV_DATABASE,
//   username: process.env.DEV_USERNAME,
//   password: process.env.DEV_PASSWORD,
// });

export const databseConnect = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Connected to Server...");
  } catch (error) {
    console.log(error.message);
  }
};

export default { sql, databseConnect };
