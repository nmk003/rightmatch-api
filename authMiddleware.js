import jwt from "jsonwebtoken";
import { sql } from "./dbConnect.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.jwtToken;
    if (!token) {
      return res.status(401).json({
        message: "Token is not available",
      });
    }
    const isAccessable = jwt.verify(token, "jwt-secret-key");

    if (!isAccessable) {
      return res.status(401).json({
        message: "Access Denied",
      });
    }
    const user =
      await sql`SELECT id, fullname, phone, email, gender, isactive FROM users WHERE id = ${isAccessable.id}`;
    console.log(user, "user");
    if (user.count === 0) {
      return res.status(401).json({
        message: "Access Denied",
      });
    }
    req.user = user[0];
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
