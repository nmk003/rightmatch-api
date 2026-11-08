import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

export const authCookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  partitioned: isProduction,
};

export const generateJWTToken = (id, res) => {
  const _jwt = jwt.sign({ id }, "jwt-secret-key", {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  res.cookie("jwtToken", _jwt, {
    ...authCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return _jwt;
};
