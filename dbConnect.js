import postgres from "postgres";
// import dotenv from "dotenv";
// dotenv.config();

export const sql = postgres({
  host: "localhost",
  port: 5432,
  database: "rightmatch",
  username: "postgres",
  password: "postgres",
});

export const databseConnect = async () => {
  try {
    const result = await sql`SELECT NOW()`;
    console.log("Connected to Server...");
  } catch (error) {
    console.log(error.message);
  }
};

export default { sql, databseConnect };
