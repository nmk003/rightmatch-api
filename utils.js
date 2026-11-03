import jwt from "jsonwebtoken";

export const generateJWTToken = (id, res) => {
  const _jwt = jwt.sign({ id }, "jwt-secret-key", {
    expiresIn: "7d",
    algorithm: "HS256",
  });
  res.cookie("jwtToken", _jwt, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
    secure: false,
  });
  return _jwt;
};
