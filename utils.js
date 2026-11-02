import jwt from "jsonwebtoken";

export const generateJWTToken = (id, res) => {
  const _jwt = jwt.sign({ id }, "jwt-secret-key", {
    expiresIn: "15m",
    algorithm: "HS256",
  });
  res.cookie("jwt", _jwt, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000,
    path: "/",
    secure: false,
  });
  return _jwt;
};
