import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies["access-token"];
    if (!token) {
      return res.status(401).json({
        message: "Access Denied",
      });
    }
    const isAccessable = jwt.verify(token, "accesstoken-secret-key");
    console.log(isAccessable);
    if (isAccessable) {
      next();
    }
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};
